import React, { Component } from "react";
import WilRnd from "wil-react-rnd";

export default class App extends Component {
  render() {
    return (
      <div className="app">
        <WilRnd
          defaultMeasure={{ width: 500, height: 300, top: 100, left: 100 }}
          widthRange={[100, 1200]}
          heightRange={[100, 1000]}
          dragHorizontalRange={[0, window.innerWidth]}
          dragVerticalRange={[0, window.innerHeight]}
          onEnd={console.log}
        >
          {({ dragRef, isStartResizable, isStartDraggable }) => (
            <div className="box">
              <div
                ref={dragRef}
                className="drag"
                style={{ background: isStartDraggable ? "#48a9c5" : "#ff6c5f" }}
              >
                Drag me
              </div>
              <div className="content">React Component Drag and resize</div>
            </div>
          )}
        </WilRnd>
      </div>
    );
  }
}
