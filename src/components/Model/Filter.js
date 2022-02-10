import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import { Icon, Input } from "semantic-ui-react";
import { Select } from "antd";
import _ from 'lodash';

import CustomSlider from "../CustomSlider";
import actions from "../../redux/model/action";
import { colors, stepValue } from "../../helpers/constant";
const { ONE, TWO } = stepValue;
const Option = Select.Option;

const Filter = (props) => {
  const [ name, setName ] = useState('');
  const [ type, setType ] = useState('default');
  const [ range, setRange ] = useState([0, 220]);
  
  useEffect(() => {
    props.getFilteredData({
      name,
      type,
      range
    })
  }, [name, type, range])

  const debouncedState = _.debounce((k, v) => {
    switch(k) {
      case 'name':
        setName(v);
        break;
      case 'type':
        setType(v);
        break;
      case 'range':
        setRange(v);
        break;
      default:
        break;
    }
  }, 600)

  return (
    <div className="filter">
        <div className="filterContent">
          <h3>Filter Models</h3>
          <Input iconPosition="left" placeholder="Search Models...">
            <input
              onChange={e => debouncedState('name', e.target.value)}
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
            value={range}
            onChange={range_ => debouncedState('range', range_)}
          />

          <label>Learn Type</label>
          <Select
            defaultValue="default"
            onChange={type_ => debouncedState('type', type_)}
          >
            <Option value="default">All types</Option>
            <Option value="type_1">type 1</Option>
            <Option value="type_2">type 2</Option>
            <Option value="type_3">type 3</Option>
            <Option value="type_4">type 4</Option>
          </Select>
        </div>
      </div>
  )
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
