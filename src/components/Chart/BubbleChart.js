import React, { Component } from "react";
import * as d3 from "d3-3";

import { connect } from "react-redux";
import CustomModal from "./CustomModal";

import { classes, sort, color, getOffset } from "../../helpers/Helpers";

export class BubbleChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: this.props.data,
      show: false,
      xScale: 0,
      yScale: 0,
      selectedCircle: null,
      selectedModel: ""
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
    const format = d3.format(",d");

    const bubble = d3.layout
      .pack()
      .sort(sort)
      .size([width, height])
      .value(function(d) {
        return d.size;
      })
      .padding(2);

    const u = d3.select(this.svgEl);

    const node = u
      .selectAll(".node")
      .data(
        bubble.nodes(classes(this.state.data)).filter(function(d) {
          return !d.children;
        })
      )
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });

    node.append("title").text(function(d) {
      return d.className + ": " + format(d.value);
    });

    node
      .append("circle")
      .attr("r", function(d) {
        return d.r;
      })
      .style("fill", color)
      .on("mousedown", this.nodeClick);
  }

  updateChart() {
    const { selectedId, show } = this.state;
    const { name, range, type } = this.props.filters;
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
    this.setState({
      show: true,
      xScale: e.x,
      yScale: e.y,
      rScale: e.r,
      color: color(e),
      selectedId: e.id,
      selectedModel: e
    });
  };

  onClick = e => {
    const svg = document.getElementById("bubbleChart");
    const { offsetX, offsetY } = getOffset(svg);
    let circleClicked = false;

    d3.selectAll("circle").each((d, i) => {
      if (
        e.clientX > d.x - d.r + offsetX &&
        e.clientX < d.x + d.r + offsetX &&
        e.clientY > d.y - d.r + offsetY &&
        e.clientY < d.y + d.r + offsetY
      ) {
        circleClicked = true;
      }
    });
    if (!circleClicked) {
      d3.selectAll("circle").style("opacity", 1);
      this.setState({ show: false });
    }
  };

  render() {
    const { show, xScale, yScale, rScale, color, selectedModel } = this.state;
    return (
      <div className="bubbleChart" onClick={this.onClick}>
        <svg
          width={this.props.width}
          height={this.props.height}
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

const mapStateToProps = state => ({
  state: state,
  models: state.Model.models,
  filters: state.Filter
});

export default connect(mapStateToProps)(BubbleChart);
