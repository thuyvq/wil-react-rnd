// @flow
import React, { Component } from "react";
import styles from "./styles.css";

type ObjectMeasure = { [string]: number };

type Props = {
  children: (draggable: Object) => React$Node,
  onDragStart: (measure: ObjectMeasure) => void,
  onResizeStart: (placement: string, measure: ObjectMeasure) => void,
  onDrag: (measure: ObjectMeasure) => void,
  onResize: (measure: ObjectMeasure) => void,
  onResizeDebounce: (measure: ObjectMeasure) => void,
  onEnd: (measure: ObjectMeasure) => void,
  defaultMeasure: ObjectMeasure,
  widthRange: Array<number>,
  heightRange: Array<number>,
  dragHorizontalRange: Array<number>,
  dragVerticalRange: Array<number>,
  timeDebounce: number,
  containerClassName: string
};

type State = {
  measure: Object,
  isStartDraggable: boolean,
  isStartResizable: boolean,
  resizeCurrent: string,
  currentOffsetY: number,
  currentOffsetX: number,
  hasZIndex: boolean
};

export default class WilRnd extends Component<Props, State> {
  static defaultProps = {
    onDragStart: (measure: ObjectMeasure): void => {},
    onResizeStart: (type: string, measure: ObjectMeasure): void => {},
    onDrag: (measure: ObjectMeasure): void => {},
    onResize: (measure: ObjectMeasure): void => {},
    onResizeDebounce: (measure: ObjectMeasure): void => {},
    onEnd: (measure: ObjectMeasure): void => {},
    widthRange: [0, Infinity],
    heightRange: [0, Infinity],
    dragHorizontalRange: [-Infinity, Infinity],
    dragVerticalRange: [-Infinity, Infinity],
    timeDebounce: 400,
    containerClassName: ""
  };

  state = {
    measure: {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    },
    isStartDraggable: false,
    isStartResizable: false,
    resizeCurrent: "",
    currentOffsetY: 0,
    currentOffsetX: 0,
    hasZIndex: false
  };

  els = {
    $container: null,
    $draggable: null,
    $top: null,
    $right: null,
    $bottom: null,
    $left: null,
    $topRight: null,
    $bottomRight: null,
    $bottomLeft: null,
    $topLeft: null
  };

  debounce = null;

  componentDidMount(): void {
    const { defaultMeasure }: Props = this.props;
    this.setState({
      measure: defaultMeasure
    });
    if (this.els.$draggable) {
      this.els.$draggable.classList.add(styles.itemDraggable);
    }
    window.addEventListener("mousedown", this._handleStartDragging);
    window.addEventListener("touchstart", this._handleStartDragging);
    window.addEventListener("mousemove", this._handleMouseMove);
    window.addEventListener("touchmove", this._handleMouseMove);
    window.addEventListener("mouseup", this._handleStopDragging);
    window.addEventListener("touchend", this._handleStopDragging);
  }

  componentWillUnmount(): void {
    window.removeEventListener("mousedown", this._handleStartDragging);
    window.removeEventListener("touchstart", this._handleStartDragging);
    window.removeEventListener("mousemove", this._handleMouseMove);
    window.removeEventListener("touchmove", this._handleMouseMove);
    window.removeEventListener("mouseup", this._handleStopDragging);
    window.removeEventListener("touchend", this._handleStopDragging);
  }

  _getEvent = (event: Object): Object => {
    return event.touches ? event.touches[0] : event;
  };

  _getOffset = (event: Object): ObjectMeasure => {
    const clientRect: Object = event.target.getBoundingClientRect();
    return event.touches
      ? {
          offsetX: event.touches[0].pageX - clientRect.left,
          offsetY: event.touches[0].pageY - clientRect.top
        }
      : {
          offsetX: event.offsetX,
          offsetY: event.offsetY
        };
  };

  _handleStartDragging = (event: Object): void => {
    const { offsetX, offsetY }: ObjectMeasure = this._getOffset(event);
    this.setState({
      currentOffsetY: offsetY,
      currentOffsetX: offsetX
    });
    this._handleStartDraggable(event);
    this._handleStartResize(event, "top");
    this._handleStartResize(event, "right");
    this._handleStartResize(event, "bottom");
    this._handleStartResize(event, "left");
    this._handleStartResize(event, "topRight");
    this._handleStartResize(event, "topLeft");
    this._handleStartResize(event, "bottomRight");
    this._handleStartResize(event, "bottomLeft");
  };

  _handleStartDraggable = (event: Object): void => {
    const { onDragStart }: Props = this.props;
    const measure: ObjectMeasure = this._getMeasure();
    if (this.els.$draggable) {
      this.setState({
        isStartDraggable: this.els.$draggable.contains(event.target)
      });
    }
    if (this.els.$draggable && this.els.$draggable.contains(event.target)) {
      onDragStart(measure);
    }
  };

  _handleStartResize = (event: Object, type: string): void => {
    const { onResizeStart }: Props = this.props;
    const measure: ObjectMeasure = this._getMeasure();
    const $type: string = `$${type}`;
    if (this.els[$type] && this.els[$type].contains(event.target)) {
      this.setState({
        resizeCurrent: type,
        isStartResizable: true
      });
      onResizeStart(type, measure);
    }
  };

  _handleMouseMove = async (event: Object): Promise<void> => {
    const {
      isStartResizable,
      resizeCurrent,
      isStartDraggable
    }: State = this.state;
    if (this.els.$container) {
      const { pageX, pageY }: ObjectMeasure = this._getEvent(event);
      const containerClientRect: ObjectMeasure = this.els.$container.getBoundingClientRect();
      const { width, height }: ObjectMeasure = containerClientRect;

      if (isStartDraggable) {
        await this._handleDragging(
          pageX,
          pageY,
          width,
          height,
          containerClientRect
        );
        this._handlePropOnDrag();
      }
      if (isStartResizable) {
        switch (resizeCurrent) {
          case "top":
            await this._handleResizeTop(pageY);
            break;
          case "right":
            await this._handleResizeRight(pageX);
            break;
          case "bottom":
            await this._handleResizeBottom(pageY);
            break;
          case "left":
            await this._handleResizeLeft(pageX);
            break;
          case "topRight":
            await Promise.all([
              this._handleResizeTop(pageY),
              this._handleResizeRight(pageX)
            ]);
            break;
          case "bottomRight":
            await Promise.all([
              this._handleResizeBottom(pageY),
              this._handleResizeRight(pageX)
            ]);
            break;
          case "bottomLeft":
            await Promise.all([
              this._handleResizeBottom(pageY),
              this._handleResizeLeft(pageX)
            ]);
            break;
          case "topLeft":
            await Promise.all([
              this._handleResizeTop(pageY),
              this._handleResizeLeft(pageX)
            ]);
            break;
          default:
            break;
        }
        this._handlePropOnResize();
      }
    }
  };

  _handlePropOnDrag = (): void => {
    const { onDrag }: Props = this.props;
    const measure: ObjectMeasure = this._getMeasure();
    onDrag(measure);
  };

  _handlePropOnResize = (): void => {
    const { onResize, onResizeDebounce, timeDebounce }: Props = this.props;
    const measure: ObjectMeasure = this._getMeasure();
    onResize(measure);
    clearTimeout(this.debounce);
    this.debounce = setTimeout((): void => {
      onResizeDebounce(measure);
    }, timeDebounce);
  };

  _handleResizeRight = async (pageX: number): Promise<void> => {
    const { widthRange }: Props = this.props;
    const measure: ObjectMeasure = this._getMeasure();
    const width: number = pageX - measure.left;
    if (width > widthRange[0] && width < widthRange[1]) {
      await this.setState({
        measure: {
          ...measure,
          width
        }
      });
    }
  };

  _handleResizeBottom = async (pageY: number): Promise<void> => {
    const { heightRange }: Props = this.props;
    const measure: ObjectMeasure = this._getMeasure();
    const height: number = pageY - measure.top;
    if (height > heightRange[0] && height < heightRange[1]) {
      await this.setState({
        measure: {
          ...measure,
          height
        }
      });
    }
  };

  _handleResizeLeft = async (pageX: number): Promise<void> => {
    const { widthRange }: Props = this.props;
    const measure: ObjectMeasure = this._getMeasure();
    const width: number = measure.width + measure.left - pageX;
    if (width > widthRange[0] && width < widthRange[1]) {
      await this.setState({
        measure: {
          ...measure,
          left: pageX,
          width
        }
      });
    }
  };

  _handleResizeTop = async (pageY: number): Promise<void> => {
    const { heightRange }: Props = this.props;
    const measure: ObjectMeasure = this._getMeasure();
    const height: number = measure.height + measure.top - pageY;
    if (height > heightRange[0] && height < heightRange[1]) {
      await this.setState({
        measure: {
          ...measure,
          top: pageY,
          height
        }
      });
    }
  };

  _handleDragging = async (
    pageX: number,
    pageY: number,
    width: number,
    height: number,
    containerClientRect: Object
  ): Promise<void> => {
    const { currentOffsetY, currentOffsetX }: State = this.state;
    if (this.els.$draggable) {
      const itemDragClientRect: {
        [string]: number
      } = this.els.$draggable.getBoundingClientRect();
      const top: number =
        pageY -
        currentOffsetY -
        (itemDragClientRect.top - containerClientRect.top);
      const left: number =
        pageX -
        currentOffsetX -
        (itemDragClientRect.left - containerClientRect.left);
      await this.setState({
        measure: { top, left, width, height }
      });
    }
  };

  _handleStopDragging = (event: SyntheticMouseEvent<any>): void => {
    const { onEnd }: Props = this.props;
    const measure: ObjectMeasure = this._getMeasure();
    this.setState({
      isStartDraggable: false,
      isStartResizable: false,
      resizeCurrent: ""
    });
    if (
      (this.els.$draggable && this.els.$draggable.contains(event.target)) ||
      (this.els.$top && this.els.$top.contains(event.target)) ||
      (this.els.$right && this.els.$right.contains(event.target)) ||
      (this.els.$bottom && this.els.$bottom.contains(event.target)) ||
      (this.els.$left && this.els.$left.contains(event.target)) ||
      (this.els.$topRight && this.els.$topRight.contains(event.target)) ||
      (this.els.$bottomRight && this.els.$bottomRight.contains(event.target)) ||
      (this.els.$bottomLeft && this.els.$bottomLeft.contains(event.target)) ||
      (this.els.$topLeft && this.els.$topLeft.contains(event.target))
    ) {
      onEnd(measure);
    }
  };

  _setRef = (el: string): Function => (c: any): void => {
    this.els[el] = c;
  };

  _handleChildrenParam = (): Object => {
    const { isStartDraggable, isStartResizable }: State = this.state;
    const measure: ObjectMeasure = this._getMeasure();
    return {
      dragRef: this._setRef("$draggable"),
      measure,
      isStartDraggable,
      isStartResizable
    };
  };

  _setHasZIndex = (value: boolean): Function => (): void => {
    this.setState({
      hasZIndex: value
    });
  };

  _checkLeft = (left: number): number => {
    const { dragHorizontalRange }: Props = this.props;
    if (left <= dragHorizontalRange[0]) {
      return dragHorizontalRange[0];
    }
    if (left >= dragHorizontalRange[1]) {
      return dragHorizontalRange[1];
    }
    return left;
  };

  _checkTop = (top: number): number => {
    const { dragVerticalRange }: Props = this.props;
    if (top <= dragVerticalRange[0]) {
      return dragVerticalRange[0];
    }
    if (top >= dragVerticalRange[1]) {
      return dragVerticalRange[1];
    }
    return top;
  };

  _getMeasure = (): Object => {
    const { measure }: State = this.state;
    const { top, left, width, height }: ObjectMeasure = measure;
    return {
      top: this._checkTop(top),
      left: this._checkLeft(left),
      width,
      height
    };
  };

  _getStyles = (): Object => {
    const { hasZIndex, isStartDraggable }: State = this.state;
    const measure: ObjectMeasure = this._getMeasure();
    const { top, left, width, height }: ObjectMeasure = measure;
    return {
      outline: "none",
      top: isStartDraggable ? 0 : top,
      left: isStartDraggable ? 0 : left,
      ...(isStartDraggable
        ? { transform: `translate(${left}px, ${top}px)` }
        : {}),
      width,
      height,
      ...(hasZIndex ? { zIndex: 10000 } : {})
    };
  };

  _renderItemResize = (): React$Node => {
    return (
      <>
        <div ref={this._setRef("$top")} className={styles.top} />
        <div ref={this._setRef("$right")} className={styles.right} />
        <div ref={this._setRef("$bottom")} className={styles.bottom} />
        <div ref={this._setRef("$left")} className={styles.left} />
        <div ref={this._setRef("$topRight")} className={styles.topRight} />
        <div ref={this._setRef("$topLeft")} className={styles.topLeft} />
        <div
          ref={this._setRef("$bottomRight")}
          className={styles.bottomRight}
        />
        <div ref={this._setRef("$bottomLeft")} className={styles.bottomLeft} />
      </>
    );
  };

  render(): React$Node {
    const { children, containerClassName }: Props = this.props;
    const { isStartDraggable, isStartResizable }: State = this.state;
    return (
      <>
        <div
          ref={this._setRef("$container")}
          style={this._getStyles()}
          className={`${styles.container} ${containerClassName}`.trim()}
          role="presentation"
          onFocus={this._setHasZIndex(true)}
          onBlur={this._setHasZIndex(false)}
          tabIndex="-1"
        >
          {children(this._handleChildrenParam())}
          {this._renderItemResize()}
        </div>
        {(isStartDraggable || isStartResizable) && (
          <div className={styles.overlay} style={{ zIndex: 99 }} />
        )}
      </>
    );
  }
}
