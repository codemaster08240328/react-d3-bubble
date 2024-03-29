import _ from "lodash";
const data = require("../../fakeapi/bubble.json");

class ModelHelper {
  getModels = async () => {
    return {
      ...data
    };
  };

  getFilteredData = async ({ payload }) => {
    const { name, range, type } = payload;
    let filteredData = { name: data.name };

    let array = _.filter(data.children, child => {
      const nameBool = name ? child.name.includes(name) : true;
      const rangeBool = range
        ? child.anomaly_detection_score >= range[0] &&
          child.anomaly_detection_score <= range[1]
        : true;
      const typeBool =
        type === "default" ? true : type ? child.type === type : true;
      return nameBool && rangeBool && typeBool;
    });

    filteredData = {
      ...filteredData,
      children: array
    };

    await timeout(2000);

    return {
      ...filteredData
    };
  };
}

const timeout = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export default new ModelHelper();
