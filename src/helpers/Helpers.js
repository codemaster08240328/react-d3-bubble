import _ from "lodash";
import { colors, stepValue } from "./constant";

const { ONE, TWO } = stepValue;

const classes = root => {
  let classes = [];

  const recurse = (name, node) => {
    if (node.children)
      node.children.forEach(child => {
        recurse(node.name, child);
      });
    else
      classes.push({
        packageName: name,
        type: node.type,
        className: node.name,
        value: node.anomaly_detection_score,
        size: node.anomaly_detection_score,
        id: node.id
      });
  };

  recurse(null, root);

  return {
    children: classes
  };
};

const sort = (a, b) => {
  let fw = 2,
    sw = 2;
  if (a.value < ONE) {
    fw = 1;
  } else if (a.value > TWO) {
    fw = 3;
  }
  if (b.value < ONE) {
    sw = 1;
  } else if (b.value > TWO) {
    sw = 3;
  }
  return fw - sw;
};

const color = d => {
  if (d.size < ONE) {
    return colors.OK;
  } else if (d.size > TWO) {
    return colors.CRITICAL;
  } else {
    return colors.WARNING;
  }
};

const getOffset = dom => {
  const bodyRect = document.body.getBoundingClientRect();
  const elemRect = dom.getBoundingClientRect();
  const offsetY = elemRect.top - bodyRect.top;
  const offsetX = elemRect.left - bodyRect.left;
  return {
    offsetX,
    offsetY
  };
};

const formatNumber = num => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

const getMax = array => {
  return _.maxBy(array, item => {
    return item["anomaly_detection_score"];
  })["anomaly_detection_score"];
};

export { classes, sort, color, getOffset, formatNumber, getMax };
