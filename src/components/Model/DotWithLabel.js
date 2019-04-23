import React from "react";

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

export default DotWithLabel;
