import React, { Component } from "react";

import { connect } from "react-redux";
import _ from "lodash";

import { Spin, Slider, Button, Icon, Tooltip } from "antd";

import CardInfo from "./CardInfo";
import DotWithLabel from "./DotWithLabel";
import Filter from "./Filter";
import BubbleChart from "../Chart/BubbleChart";
import ChartController from "./ChartController";

import actions from "../../redux/model/action";
import { colors, stepValue } from "../../helpers/constant";
import "./style.css";

const translateStep = 10;
const scalingStep = 0.01;

export class Model extends Component {
  state = {
    width: 0,
    height: 0,
    reset: false
  };

  componentDidMount() {
    this.props.getModels();
    console.log(
      this.refs.chartDiv.clientWidth,
      this.refs.chartDiv.clientHeight
    );
    const { chartDiv } = this.refs;
    this.setState({
      width: chartDiv.clientWidth - 10,
      height: chartDiv.clientHeight - 80
    });
  }

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

  onReset = () => {
    this.setState(
      {
        reset: true
      },
      () => {
        this.setState({
          reset: false
        });
      }
    );
  };

  formatter = value => {
    return `${value} x`;
  };

  render() {
    const { width, height, reset } = this.state;
    const { models } = this.props;
    const {
      TOTAL_COUNTS,
      OK_COUNTS,
      CRITICAL_COUNTS,
      WARNING_COUNTS
    } = this.getCountsOfModels(models);

    return (
      <div className="bubbleContainer">
        <div className="bubbleInfo">
          <CardInfo value={TOTAL_COUNTS || 0} label="Total Models" />
          <CardInfo value={OK_COUNTS || 0} label="OK" color={colors.OK} />
          <CardInfo
            value={WARNING_COUNTS || 0}
            label="Warning"
            color={colors.WARNING}
          />
          <CardInfo
            value={CRITICAL_COUNTS || 0}
            label="Critical"
            color={colors.CRITICAL}
          />
        </div>

        <div className="bubbleMain">
          <div className="leftSide">
            <Filter />
          </div>

          <div className="chart" ref="chartDiv">
            {models && (
              <BubbleChart
                reset={reset}
                width={width}
                height={height}
                data={this.props.models}
              />
            )}

            {!models && (
              <div className="spinDiv">
                <Spin tip="Loading..." />
              </div>
            )}

            {models && (
              <div className="footer">
                <div className="section" />
                <div className="section">
                  <DotWithLabel color={colors.OK} label="OK" />
                  <DotWithLabel color={colors.WARNING} label="WARNING" />
                  <DotWithLabel color={colors.CRITICAL} label="CRITICAL" />
                </div>

                <div className="section">
                  <Button type="danger" onClick={() => this.onReset()}>
                    Reset
                  </Button>
                </div>
              </div>
            )}
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
