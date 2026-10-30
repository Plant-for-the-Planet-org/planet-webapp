import { describe, expect, it } from 'vitest';

import { isEmailValid } from './isEmailValid';

describe('isEmailValid', () => {
  it.each([
    'user@plant-for-the-planet.org',
    'first.last@gmail.com',
    'user+tag@gmail.com',
    "o'brien@company.ie",
    'user@mail.sub.domain.org',
    'USER@GMAIL.COM',
    'user_name-1@my-domain.co.uk',
  ])('accepts %s', (email) => {
    expect(isEmailValid(email)).toBe(true);
  });

  it.each([
    'user@dummy.de',
    'user@example.com',
    'user@company.de',
    'user@Example.com',
    'user@EXAMPLE.COM',
    'user@Dummy.De',
  ])('rejects blocked domain in %s', (email) => {
    expect(isEmailValid(email)).toBe(false);
  });

  it('allows subdomains of blocked domains', () => {
    expect(isEmailValid('user@mail.example.com')).toBe(true);
  });

  it.each([
    ['empty string', ''],
    ['only spaces', '   '],
    ['space inside', 'us er@gmail.com'],
    ['leading space', ' user@gmail.com'],
    ['double @', 'user@@gmail.com'],
    ['two @ signs', 'user@name@gmail.com'],
    ['missing domain', 'user@'],
    ['missing local part', '@gmail.com'],
    ['missing top-level domain', 'user@gmail'],
    ['no @', 'user.gmail.com'],
    ['unicode local part', 'jürgen@gmail.com'],
    ['unicode domain', 'user@münchen.de'],
    ['double dot', 'user..name@gmail.com'],
    ['leading dot', '.user@gmail.com'],
  ])('rejects %s', (_label, email) => {
    expect(isEmailValid(email)).toBe(false);
  });
});
