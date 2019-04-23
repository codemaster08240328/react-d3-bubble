const actions = {
  SET_FILTER: "SET_FILTER",
  setFilter: payload => ({
    type: actions.SET_FILTER,
    payload
  })
};

export default actions;
