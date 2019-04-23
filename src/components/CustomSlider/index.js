import React, { Component } from "react";

import { Slider, InputNumber } from "antd";
import { getPercentage } from "./helper";

import "./style.css";

export default class CustomSlider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fir_val: this.props.min,
      sec_val: this.props.max
    };
  }

  componentDidMount() {
    const { min, max, marks, colors } = this.props;
    const per_fir = getPercentage(min, max, marks.fir);
    const per_sec = getPercentage(min, max, marks.sec);

    const slider = document.getElementsByClassName("ant-slider-step")[0];
    const innerDiv = document.createElement("div");
    innerDiv.style.height = "100%";
    innerDiv.style.background = `linear-gradient(90deg, ${colors.fir}, ${
      colors.fir
    } ${per_fir}, ${colors.sec} ${per_fir}, ${colors.sec} ${per_sec}, ${
      colors.thi
    } ${per_sec}, ${colors.thi} 100% )`;
    slider.append(innerDiv);

    const handles = document.getElementsByClassName("ant-slider-handle");
    handles[0].style.border = "2px solid white";
    handles[0].style.boxShadow = "0 0 5px";
    handles[0].style.backgroundColor = colors.fir;
    handles[1].style.border = "2px solid white";
    handles[1].style.boxShadow = "0 0 5px";
    handles[1].style.backgroundColor = colors.thi;
  }

  componentDidUpdate() {
    const { value } = this.props;
    this.changeColorSpin(value[0], 1);
    this.changeColorSpin(value[1], 2);
  }

  onSliderChange = value => {
    this.setState({
      fir_val: value[0],
      sec_val: value[1]
    });

    this.props.onChange(value);
  };

  onFirChange = value => {
    this.setState({
      fir_val: value
    });
    this.props.onChange([value, this.state.sec_val]);
    this.changeColorSpin(value, 1);
  };

  onSecChange = value => {
    this.setState({
      sec_val: value
    });
    this.props.onChange([this.state.fir_val, value]);
    this.changeColorSpin(value, 2);
  };

  changeColorSpin = (value, index) => {
    const { marks, colors } = this.props;

    const handle =
      index === 1
        ? document.querySelector(".ant-slider-handle.ant-slider-handle-1")
        : document.querySelector(".ant-slider-handle.ant-slider-handle-2");

    if (value < marks.fir) {
      handle.style.backgroundColor = colors.fir;
    } else if (value > marks.sec) {
      handle.style.backgroundColor = colors.thi;
    } else {
      handle.style.backgroundColor = colors.sec;
    }
  };

  render() {
    const { min, max } = this.props;
    return (
      <div>
        <Slider
          range
          min={min}
          max={max}
          value={this.props.value}
          onChange={this.onSliderChange}
        />
        <div className="divValue">
          <InputNumber
            min={min}
            max={max}
            value={this.props.value[0]}
            className="inputValue"
            onChange={this.onFirChange}
          />
          <InputNumber
            min={min}
            max={max}
            value={this.props.value[1]}
            className="inputValue"
            onChange={this.onSecChange}
          />
        </div>
      </div>
    );
  }
}
