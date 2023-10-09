import { z } from 'zod';

export const isEmailValid = (value: string): boolean => {
  try {
    const emailSchema = z.string().email();
    emailSchema.parse(value);
  } catch (err) {
    return false;
  }
  return true;
};
