declare module "wil-react-rnd" {
  export interface Props {
    children: (draggable: Object) => React.ReactNode;
    onDragStart: (measure: Object) => void;
    onResizeStart: (placement: string, measure: Object) => void;
    onDrag: (measure: Object) => void;
    onResize: (measure: Object) => void;
    onResizeDebounce: (measure: Object) => void;
    onEnd: (measure: Object) => void;
    defaultMeasure: Object;
    widthRange: Array<number>;
    heightRange: Array<number>;
    dragHorizontalRange: Array<number>;
    dragVerticalRange: Array<number>;
    timeDebounce: number;
    containerClassName: string;
  }

  export interface State {
    measure: Object;
    isStartDraggable: boolean;
    isStartResizable: boolean;
    resizeCurrent: string;
    currentOffsetY: number;
    currentOffsetX: number;
    hasZIndex: boolean;
  }

  export default class WilRnd<State extends object> {
    state: State;
    props: Props;
  }
}
