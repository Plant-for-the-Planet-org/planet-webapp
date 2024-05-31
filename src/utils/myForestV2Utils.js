export const calculatePercentage = (targetValue, targetFulfilled) => {
  if (targetValue > 0) {
    const percentage = (Math.round(targetFulfilled) / targetValue) * 100;
    return percentage;
  } else {
    return 0;
  }
};
