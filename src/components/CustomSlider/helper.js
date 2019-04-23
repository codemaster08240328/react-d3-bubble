const getPercentage = (min, max, value) => {
  return (((value - min) / (max - min)) * 100).toFixed(2) + "%";
};

export { getPercentage };
