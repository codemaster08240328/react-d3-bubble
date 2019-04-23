import React, { Component } from "react";
import { formatNumber } from "../../helpers/Helpers";

export default class CardInfo extends Component {
  render() {
    const { value, label, color } = this.props;
    const coloredDiv = color
      ? { borderTopColor: color, borderTopWidth: 5 }
      : { marginTop: 2 };
    const coloredLabel = color
      ? { marginTop: 5, color: color }
      : { marginTop: 5 };
    return (
      <div className="customDiv" style={coloredDiv}>
        <label>{formatNumber(value)}</label>
        <label style={coloredLabel}>{label}</label>
      </div>
    );
  }
}
