import React, { Component } from "react";

import { connect } from "react-redux";
import _ from "lodash";

import CardInfo from "./CardInfo";
import DotWithLabel from "./DotWithLabel";
import Filter from "./Filter";
import BubbleChart from "../Chart/BubbleChart";
import ChartController from "./ChartController";

import actions from "../../redux/model/action";
import { colors, stepValue } from "../../helpers/constant";
import "./style.css";

export class Model extends Component {
  state = {
    scale: 1,
    translate: [0, 0]
  };

  componentDidMount() {
    this.props.getModels();
    document.addEventListener("keydown", this._handleKeyDown);
  }

  _handleKeyDown = e => {
    const { scale, translate } = this.state;
    console.log(e.keyCode);
    let value;
    switch (e.keyCode) {
      case 189:
        if (scale > 1) {
          this.setState({ scale: scale - 1 });
        }
        break;

      case 187:
        if (scale < 10) {
          this.setState({ scale: scale + 1 });
        }
        break;

      case 37:
        value = [translate[0] - 100, translate[1]];
        this.setState({ translate: value });
        break;

      case 38:
        value = [translate[0], translate[1] - 100];
        this.setState({ translate: value });
        break;

      case 39:
        value = [translate[0] + 100, translate[1]];
        this.setState({ translate: value });
        break;

      case 40:
        value = [translate[0], translate[1] + 100];
        this.setState({ translate: value });
        break;

      default:
        break;
    }
  };

  getCountsOfModels = models => {
    if (models) {
      const { ONE, TWO } = stepValue;
      const TOTAL_COUNTS = models.children.length;

      const OK_COUNTS = _.filter(models.children, item => {
        return item["anomaly_detection_score"] < ONE;
      }).length;

      const CRITICAL_COUNTS = _.filter(models.children, item => {
        return item["anomaly_detection_score"] > TWO;
      }).length;

      const WARNING_COUNTS = TOTAL_COUNTS - OK_COUNTS - CRITICAL_COUNTS;

      return {
        TOTAL_COUNTS,
        OK_COUNTS,
        CRITICAL_COUNTS,
        WARNING_COUNTS
      };
    } else {
      return {
        TOTAL_COUNTS: "...",
        OK_COUNTS: "...",
        CRITICAL_COUNTS: "...",
        WARNING_COUNTS: "..."
      };
    }
  };

  onScaleChange = scale => {
    this.setState({ scale });
  };

  onTranslateChange = translate => {
    this.setState({ translate });
  };

  onReset = () => {
    this.setState({
      scale: 1,
      translate: [0, 0]
    });
  };

  render() {
    const { scale, translate } = this.state;
    const { models } = this.props;
    const {
      TOTAL_COUNTS,
      OK_COUNTS,
      CRITICAL_COUNTS,
      WARNING_COUNTS
    } = this.getCountsOfModels(models);

    return (
      <div>
        <div className="info">
          <CardInfo value={TOTAL_COUNTS} label="Total Models" />
          <CardInfo value={OK_COUNTS} label="OK" color={colors.OK} />
          <CardInfo
            value={WARNING_COUNTS}
            label="Warning"
            color={colors.WARNING}
          />
          <CardInfo
            value={CRITICAL_COUNTS}
            label="Critical"
            color={colors.CRITICAL}
          />
        </div>
        <div className="info">
          {models && (
            <div className="leftSide">
              <Filter />
              <ChartController
                scale={scale}
                onScaleChange={this.onScaleChange}
                translate={translate}
                onTranslateChange={this.onTranslateChange}
                resetClick={this.onReset}
              />
            </div>
          )}

          <div className="chart">
            {models && (
              <BubbleChart
                width={1000}
                height={750}
                data={this.props.models}
                scale={scale}
                translate={translate}
              />
            )}
            {!models && <p>Loading...</p>}
            <div className="dotDiv">
              <DotWithLabel color={colors.OK} label="OK" />
              <DotWithLabel color={colors.WARNING} label="WARNING" />
              <DotWithLabel color={colors.CRITICAL} label="CRITICAL" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  state: state,
  models: state.Model.models
});

const mapDispatchToProps = dispatch => {
  return { getModels: () => dispatch(actions.getModels()) };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Model);
