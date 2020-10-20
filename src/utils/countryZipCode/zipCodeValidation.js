import COUNTRY_ADDRESS_POSTALS from './index';

const zipCodeValidation = (name, zipCode) => {
  const fiteredCountry = COUNTRY_ADDRESS_POSTALS.filter((country) => country.abbrev === name);
  if (fiteredCountry[0].postal.test(zipCode) === false) {
    return false;
  }
  return true;
};

export default zipCodeValidation;
