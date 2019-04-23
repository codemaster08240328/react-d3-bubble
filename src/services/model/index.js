const data = require("../../fakeapi/bubble.json");

class ModelHelper {
  getModels = async () => {
    return {
      ...data
    };
  };
}

export default new ModelHelper();
