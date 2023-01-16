const INVALID_DOMAIN_LIST = ['dummy.de', 'example.com', 'company.de'];

const generateInvalidEmailRegex = (): string => {
  const startingPattern =
    '^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+.)?[a-zA-Z]+.)?(';
  const domainList = INVALID_DOMAIN_LIST.join('|');
  const endingPattern = ')$';
  return `${startingPattern}${domainList}${endingPattern}`;
};

const INVALID_DOMAIN_REGEX = new RegExp(generateInvalidEmailRegex(), 'i');
const EMAIL_FORMAT_REGEX =
  /^([a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/i;

/**
 * Validates provided email address for standard email format, and against excluded/invalid domains
 * @param {string} email - Email address to be validated
 * @returns boolean
 */
export const isEmailValid = (email: string): boolean => {
  return EMAIL_FORMAT_REGEX.test(email) && !INVALID_DOMAIN_REGEX.test(email);
};
