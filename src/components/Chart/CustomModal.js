import React, { Component } from "react";
import PropTypes from "prop-types";

import "./modal_style.css";

export class CustomModal extends Component {
  render() {
    const { xScale, yScale, rScale } = this.props.position;
    const { color, model } = this.props;

    const outStyle = {
      top: yScale,
      left: xScale + 2 * rScale + 5
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
          <span>Anomaly Detection Score: {model.size}</span>
          <span>Learn type: {model.type}</span>
        </div>
      </div>
    );
  }
}

CustomModal.propTypes = {
  color: PropTypes.string.isRequired,
  model: PropTypes.object.isRequired,
  position: PropTypes.object.isRequired
};

export default CustomModal;
