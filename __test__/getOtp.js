const axios = require('axios');

export const getOtp = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${process.env.TEST_MFA_URL}`, {
        crossdomain: true,
      })
      .then(function (response) {
        // handle success
        console.log(typeof response, response.data);
        resolve(response.data.token);
      })
      .catch(function (error) {
        // handle error
        console.log('error here', error);
        reject(error);
      });
  });
};
