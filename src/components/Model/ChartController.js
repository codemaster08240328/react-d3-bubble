import React, { Component } from "react";
import { Slider, Button, Icon, Tooltip } from "antd";

const translateStep = 10;
const scalingStep = 0.01;

export default class ChartController extends Component {
  formatter = value => {
    return `${value} x`;
  };

  onChange = value => {
    this.props.onScaleChange(value);
  };

  onTranslate = arrow => {
    const { translate } = this.props;
    let value;
    switch (arrow) {
      case "left":
        value = [translate[0] - translateStep, translate[1]];
        this.props.onTranslateChange(value);
        break;
      case "right":
        value = [translate[0] + translateStep, translate[1]];
        this.props.onTranslateChange(value);
        break;
      case "up":
        value = [translate[0], translate[1] - translateStep];
        this.props.onTranslateChange(value);
        break;
      case "down":
        value = [translate[0], translate[1] + translateStep];
        this.props.onTranslateChange(value);
        break;
      default:
        this.props.onTranslateChange(translate);
    }
  };

  resetClick = () => {
    this.props.resetClick();
  };

  render() {
    return (
      <div className="controller">
        <h3>Chart Controller</h3>

        <label className="labeling">Zooming </label>
        <Tooltip
          placement="topRight"
          title="You can use +/- key on your keyboard"
        >
          <Icon type="question-circle" />
        </Tooltip>

        <div>
          <Slider
            min={1}
            max={10}
            step={scalingStep}
            tipFormatter={this.formatter}
            onChange={this.onChange}
            value={this.props.scale}
          />
        </div>

        <label className="labeling">Panning </label>
        <Tooltip
          placement="topRight"
          title="You can use Left/Right/Up/Down key on your keyboard"
        >
          <Icon type="question-circle" />
        </Tooltip>

        <div className="updown">
          <Button onClick={() => this.onTranslate("up")}>
            <Icon type="up" />
          </Button>
        </div>

        <div className="updown">
          <Button onClick={() => this.onTranslate("left")}>
            <Icon type="left" />
          </Button>

          <Button
            className="rightBtn"
            onClick={() => this.onTranslate("right")}
          >
            <Icon type="right" />
          </Button>
        </div>

        <div className="updown">
          <Button onClick={() => this.onTranslate("down")}>
            <Icon type="down" />
          </Button>
        </div>

        <div className="resetDiv">
          <Button type="danger" onClick={() => this.resetClick()}>
            Reset
          </Button>
        </div>
      </div>
    );
  }
}
