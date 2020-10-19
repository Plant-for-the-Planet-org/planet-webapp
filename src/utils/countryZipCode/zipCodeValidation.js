import COUNTRY_ADDRESS_POSTALS from './index';

const zipCodeValidation = (name, zipCode) => {
  const fiteredCountry = COUNTRY_ADDRESS_POSTALS.filter((country) => country.abbrev === name);
  return fiteredCountry[0].postal;
  // if (fiteredCountry) {
  //   if (fiteredCountry[0].postal === null || fiteredCountry[0].postal === undefined) {
  //     return true;
  //   }
  //   if (fiteredCountry[0].postal.test(zipCode) === true) {
  //     return true;
  //   }
  //   return false;
  // }
};

export default zipCodeValidation;
