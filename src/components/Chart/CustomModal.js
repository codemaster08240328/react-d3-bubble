import React, { Component } from "react";

import { getOffset } from "../../helpers/Helpers";
import "./modal_style.css";

export class CustomModal extends Component {
  render() {
    const svg = document.getElementById("bubbleChart");
    const { offsetX, offsetY } = getOffset(svg);
    console.log(offsetX, offsetY);
    const { xScale, yScale, rScale } = this.props.position;
    const { color, model } = this.props;

    const outStyle = {
      top: yScale + offsetY - rScale - 2,
      left: xScale + offsetX + rScale + 9
    };
    const modalStyle = {
      "--color-var": color,
      borderLeftColor: color
    };
    return (
      <div className="outLine" style={outStyle}>
        <div className="modalBox" style={modalStyle}>
          <h4>Model</h4>
          <span>Model Name: {model.className}</span>
          <span>Model Size: {model.size}</span>
          <span>Learn type: {model.type}</span>
        </div>
      </div>
    );
  }
}

export default CustomModal;