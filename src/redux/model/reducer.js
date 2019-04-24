import actions from "./action";

const initState = {
  loading: null,
  models: null,
  success: null
};

export default (state = initState, action) => {
  switch (action.type) {
    case actions.GET_MODELS:
      return {
        ...state,
        loading: true,
        models: null,
        success: null
      };
    case actions.GET_FILTER:
      return {
        ...state,
        loading: true,
        models: null,
        success: null
      };
    case actions.GET_MODELS_SUCCESS:
      return {
        ...state,
        loading: false,
        models: action.payload,
        success: true
      };

    case actions.GET_MODELS_ERROR:
      return {
        ...state,
        loading: false,
        models: null,
        success: false
      };

    default:
      return state;
  }
};
