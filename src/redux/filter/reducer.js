import actions from "./action";

const initState = {
  name: null,
  range: null,
  type: null
};

export default (state = initState, action) => {
  switch (action.type) {
    case actions.SET_FILTER:
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
};
