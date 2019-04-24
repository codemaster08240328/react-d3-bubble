const actions = {
  GET_MODELS: "GET_MODELS",
  GET_FILTER: "GET_FILTER",
  GET_MODELS_SUCCESS: "GET_MODELS_SUCCESS",
  GET_MODELS_ERROR: "GET_MODELS_ERROR",
  getModels: () => ({
    type: actions.GET_MODELS
  }),
  getFilteredData: payload => ({
    type: actions.GET_FILTER,
    payload
  })
};

export default actions;
