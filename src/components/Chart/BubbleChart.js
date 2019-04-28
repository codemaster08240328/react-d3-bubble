import React, { Component } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3-3";
import _ from "lodash";

import { connect } from "react-redux";
import CustomModal from "./CustomModal";

import { classes, sort, color } from "../../helpers/Helpers";

import "./modal_style.css";

let zoom;

export class BubbleChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: this.props.data,
      show: false,
      xScale: 0,
      yScale: 0,
      selectedCircle: null,
      selectedModel: {},
      hover: 0,
      color: "white"
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

    zoom = d3.behavior
      .zoom()
      .scaleExtent([1, 10])
      .on("zoom", this.zoomHandler);

    const svg = u
      .append("g")
      .call(zoom)
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
      .on("mouseover", e => {
        this.setState({
          hover: 1
        });
        this.nodeClick(e);
      })
      .on("mouseout", e => {
        node.selectAll("circle").style("opacity", 1);
        this.setState({
          show: false,
          hover: 0
        });
      });
  }

  updateChart() {
    const { selectedId, show } = this.state;
    const { reset } = this.props;

    if (reset) {
      this.interpolateZoom([0, 0], 1);
    }

    if (show) {
      d3.selectAll("circle")
        .transition()
        .duration(100)
        .style("opacity", 1)
        .filter(a => {
          return a.id !== selectedId;
        })
        .transition()
        .duration(100)
        .style("opacity", 0.5);
    }
  }

  zoomHandler() {
    d3.select("#g-container").attr(
      "transform",
      "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")"
    );
  }

  interpolateZoom(translate, scale) {
    const self = this;
    return d3
      .transition()
      .duration(350)
      .tween("zoom", function() {
        var iTranslate = d3.interpolate(zoom.translate(), translate),
          iScale = d3.interpolate(zoom.scale(), scale);
        return function(t) {
          zoom.scale(iScale(t)).translate(iTranslate(t));
          self.zoomHandler();
        };
      });
  }

  nodeClick = _.debounce(e => {
    const selectedCircle = document.getElementById(`circle-${e.id}`);
    const elemRect = selectedCircle.getBoundingClientRect();

    if (this.state.hover === 1) {
      this.setState({
        show: true
      });
    }

    this.setState({
      xScale: elemRect.left,
      yScale: elemRect.top,
      rScale: elemRect.width / 2,
      color: color(e),
      selectedId: e.id,
      selectedModel: e,
      hover: 1
    });
  }, 600);

  render() {
    const { show, xScale, yScale, rScale, color, selectedModel } = this.state;
    const { width, height } = this.props;
    return (
      <div className="bubbleChart" onClick={this.onClick}>
        <svg
          width={width}
          height={height}
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
