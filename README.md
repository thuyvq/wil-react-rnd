# Wil React Rnd
Component Modal Drag & Resize For React

### Installation

**npm**

```bash
npm install wil-react-rnd --save
```

**yarn**

```bash
yarn add wil-react-rnd
```

**Example**

#### [https://codesandbox.io/s/wil-rnd-5n4o1](https://codesandbox.io/s/wil-rnd-5n4o1)

```js
import React from "react";
import WilRnd from "wil-react-rnd";

class App extends React.Component {
  render() {
    return (
      <WilRnd
        defaultMeasure={{ width: 500, height: 300, top: 100, left: 100 }}
        widthRange={[100, 1200]}
        heightRange={[100, 1000]}
        dragHorizontalRange={[0, window.innerWidth]}
        dragVerticalRange={[0, window.innerHeight]}
        onEnd={console.log}
      >
        {({ dragRef, isStartResizable, isStartDraggable }) => (
          <div>
            <button ref={dragRef}>Drag me</button>
            Content
          </div>
        )}
      </WilRnd>
    )
  }
```

**API**

| Prop                  | Type                                | Default | Description |
| :---------            | :-------:                           | :-----: | :----------- |
| widthRange             | `Array<number>`                     | `[0, Infinity]`       | [min width, max width] |
| heightRange             | `Array<number>`                     | `[0, Infinity]`       | [min height, max height] |
| dragHorizontalRange     | `Array<number>`                     | `[-Infinity, Infinity]`  | [min drag horizontal, max drag horizontal] |
| dragVerticalRange     | `Array<number>`                     | `[-Infinity, Infinity]`  | [min drag vertical, max drag vertical] |
| containerClassName     | `string`                     | -  | className for component container |
| children             | `({ dragRef: HTLMElement, isStartResizable: boolean, isStartDraggable: boolean }) => React.Node`  | -       | dragRef example: `<button ref={dragRef}>Drag me</button>`, isStartResizable: when component resizing, isStartDraggable: when component dragging  |
| onDragStart             | `(measure: Object) => void`  | -       | Callback executed when component drag start  |
| onResizeStart             | `(placement: string, measure: Object) => void`  | -       | Callback executed when component resize start  |
| onDrag             | `(measure: Object) => void`  | -       | Callback executed when component dragging  |
| onResize             | `(measure: Object) => void`  | -       | Callback executed when component resizing  |
| onEnd             | `(measure: Object) => void`  | -       | Callback executed when component drag & resize stop  |
| onResizeDebounce             | `(measure: Object) => void`  | -       | Callback executed when component resizing ( using prop timeDebounce)  |
| timeDebounce             | `number`  | `400`       | timeDebounce for prop onResizeDebounce  |
