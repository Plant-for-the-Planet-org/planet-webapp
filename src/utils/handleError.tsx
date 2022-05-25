export const handleError = (err, callback) => {
  if (err) {
    if (err.response?.data) {
      if (
        err.response.data.errors &&
        err.response.data.errors.errors.length > 0
      ) {
        err.response.data.errors.errors.forEach((_err) => {
          callback(Error(_err));
        });
      }
    }
  }
};
