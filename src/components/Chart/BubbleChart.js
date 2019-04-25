import React, { Component } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3-3";

import { connect } from "react-redux";
import CustomModal from "./CustomModal";

import { classes, sort, color } from "../../helpers/Helpers";

import "./modal_style.css";

export class BubbleChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: this.props.data,
      show: false,
      xScale: 0,
      yScale: 0,
      selectedCircle: null,
      selectedModel: "",
      scale: 1,
      translate: [0, 0]
    };
  }

  componentDidMount() {
    this.drawChart();
  }

  componentDidUpdate() {
    this.updateChart();
  }

  drawChart() {
    const { width, height } = this.props;

    const bubble = d3.layout
      .pack()
      .sort(sort)
      .size([width, height])
      .value(d => {
        return d.size;
      })
      .padding(2);

    const u = d3.select(this.svgEl);

    const svg = u
      .append("g")
      .attr("width", width)
      .attr("height", height);

    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all");

    const container = svg.append("g").attr("id", "g-container");

    const node = container
      .selectAll(".node")
      .data(
        bubble.nodes(classes(this.state.data)).filter(d => {
          return !d.children;
        })
      )
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => {
        return "translate(" + d.x + "," + d.y + ")";
      });

    node
      .append("circle")
      .attr("id", d => {
        return `circle-${d.id}`;
      })
      .attr("r", d => {
        return d.r;
      })
      .style("fill", color)
      .on("mouseover", this.nodeClick)
      .on("mouseout", e => {
        node.selectAll("circle").style("opacity", 1);
        this.setState({
          show: false
        });
      });
  }

  updateChart() {
    const { selectedId, show } = this.state;
    const { scale, filters, translate } = this.props;
    const { name, range, type } = filters;

    d3.select("#g-container").attr(
      "transform",
      "translate(" + translate + ")scale(" + scale + ")"
    );

    if (show) {
      d3.selectAll("circle")
        .style("opacity", 1)
        .filter(a => {
          return a.id !== selectedId;
        })
        .style("opacity", 0.5);
    } else if (name) {
      d3.selectAll("circle")
        .style("opacity", 1)
        .filter(a => {
          return a.className !== name;
        })
        .style("opacity", 0.5);
    } else if (range) {
      d3.selectAll("circle")
        .style("opacity", 1)
        .filter(a => {
          if (type === "default") {
            return a.size < range[0] || a.size > range[1];
          } else if (type) {
            return a.size < range[0] || a.size > range[1] || a.type !== type;
          } else {
            return a.size < range[0] || a.size > range[1];
          }
        })
        .style("opacity", 0.5);
    }
  }

  nodeClick = e => {
    const selectedCircle = document.getElementById(`circle-${e.id}`);
    const elemRect = selectedCircle.getBoundingClientRect();

    this.setState({
      show: true,
      xScale: elemRect.left,
      yScale: elemRect.top,
      rScale: elemRect.width / 2,
      color: color(e),
      selectedId: e.id,
      selectedModel: e
    });
  };

  render() {
    const { show, xScale, yScale, rScale, color, selectedModel } = this.state;
    const { width, height } = this.props;
    return (
      <div className="bubbleChart" onClick={this.onClick}>
        <svg
          width={width}
          height={height}
          // className="svgBubble"
          ref={el => (this.svgEl = el)}
          id="bubbleChart"
        />

        {show && (
          <CustomModal
            position={{ xScale, yScale, rScale }}
            color={color}
            model={selectedModel}
          />
        )}
      </div>
    );
  }
}

BubbleChart.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  state: state,
  models: state.Model.models,
  filters: state.Filter
});

export default connect(mapStateToProps)(BubbleChart);
