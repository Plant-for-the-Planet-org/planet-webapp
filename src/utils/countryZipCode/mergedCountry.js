import COUNTRY_ADDRESS_POSTALS from './index';
import Country from '../countryCurrency/countriesData.json';

const mergedCountries = () => {
  const mergedCountryArray = [];
  Country.forEach((element) => COUNTRY_ADDRESS_POSTALS.forEach((ele) => {
    if (element.countryName === ele.name) {
      const newArr = { ...element, ...ele };
      mergedCountryArray.push(newArr);
    }
  }));

  return mergedCountryArray;
};

export default mergedCountries;
