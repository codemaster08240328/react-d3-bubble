import React from "react";
import PropTypes from "prop-types";

const spanStyle = {
  marginLeft: 10
};

const DotWithLabel = props => {
  const OK = {
    backgroundColor: props.color
  };
  return (
    <div className="dotContent">
      <span className="dot" style={OK} />
      <span style={spanStyle}>{props.label}</span>
    </div>
  );
};

DotWithLabel.propTypes = {
  color: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};

export default DotWithLabel;
