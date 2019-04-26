import React, { Component } from "react";
import { connect } from "react-redux";

import { Icon, Input } from "semantic-ui-react";
import { Select, Button } from "antd";

import CustomSlider from "../CustomSlider";
import actions from "../../redux/model/action";
import { colors, stepValue } from "../../helpers/constant";
const { ONE, TWO } = stepValue;

const Option = Select.Option;
const primaryStyle = {
  marginRight: 10
};

export class Filter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      range: [0, 0],
      type: "default"
    };
  }

  componentDidMount() {
    this.setState({
      range: [0, 220]
    });
  }

  onClickApply = e => {
    e.preventDefault();
    const { name, range, type } = this.state;
    const payload = {
      name,
      range,
      type
    };
    this.props.getFilteredData(payload);
  };

  clickClear = e => {
    e.preventDefault();
    this.setState({
      name: "",
      range: [0, 220],
      type: "default"
    });
    const payload = {
      name: "",
      range: [0, 220],
      type: "default"
    };
    this.props.getFilteredData(payload);
  };

  selectChange = value => {
    this.setState({
      type: value
    });
  };

  render() {
    return (
      <div className="filter">
        <div className="filterContent">
          <h3>Filter Models</h3>
          <Input iconPosition="left" placeholder="Search Models...">
            <input
              onChange={e => this.setState({ name: e.target.value })}
              value={this.state.name}
            />
            <Icon name="search" />
          </Input>

          <label>Anomaly Detection Score</label>
          <CustomSlider
            min={0}
            max={220}
            marks={{ fir: ONE, sec: TWO }}
            colors={{
              fir: colors.OK,
              sec: colors.WARNING,
              thi: colors.CRITICAL
            }}
            value={this.state.range}
            onChange={range => this.setState({ range })}
          />

          <label>Learn Type</label>
          <Select
            defaultValue="default"
            value={this.state.type}
            onChange={this.selectChange}
          >
            <Option value="default">All types</Option>
            <Option value="type_1">type 1</Option>
            <Option value="type_2">type 2</Option>
            <Option value="type_3">type 3</Option>
            <Option value="type_4">type 4</Option>
          </Select>

          <div className="action">
            <Button
              type="primary"
              style={primaryStyle}
              onClick={this.onClickApply}
            >
              Apply
            </Button>
            <Button type="danger" onClick={this.clickClear}>
              Clear
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  state: state,
  models: state.Model.models,
  filters: state.Filter
});

const mapDispatchToProps = dispatch => {
  return {
    getFilteredData: payload => dispatch(actions.getFilteredData(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filter);
