import React, { Component } from "react";

import { connect } from "react-redux";
import _ from "lodash";

import CardInfo from "./CardInfo";
import DotWithLabel from "./DotWithLabel";
import Filter from "./Filter";
import BubbleChart from "../Chart/BubbleChart";

import actions from "../../redux/model/action";
import { colors, stepValue } from "../../helpers/constant";
import "./style.css";

export class Model extends Component {
  componentDidMount() {
    this.props.getModels();
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

  render() {
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
          {models && <Filter />}
          <div className="chart">
            {models && (
              <BubbleChart width={750} height={750} data={this.props.models} />
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
