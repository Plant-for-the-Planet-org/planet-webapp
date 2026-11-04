import { z } from 'zod';

const INVALID_DOMAIN_LIST = ['dummy.de', 'example.com', 'company.de'];

export const isEmailValid = (value: string): boolean => {
  try {
    const emailSchema = z.email();
    const parsedEmail = emailSchema.parse(value);

    // Domains are case-insensitive, so Example.com must be blocked too.
    const domain = parsedEmail.split('@')[1].toLowerCase();

    // Check if the domain is in the INVALID_DOMAIN_LIST
    if (INVALID_DOMAIN_LIST.includes(domain)) {
      return false;
    }
  } catch (err) {
    return false;
  }
  return true;
};
