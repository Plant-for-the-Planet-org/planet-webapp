import { describe, expect, it } from 'vitest';

import {
  getExpiryInfo,
  getSepaCreditor,
  setupIntentIdFromSecret,
} from './savedPaymentMethod';

// 15 March 2027, local time.
const NOW = new Date(2027, 2, 15, 12).getTime();

describe('getExpiryInfo', () => {
  it('formats the platform value as MM/YY', () => {
    expect(getExpiryInfo('1/2030', NOW).date).toBe('01/30');
    expect(getExpiryInfo('12/30', NOW).date).toBe('12/30');
  });

  it('keeps a card valid through the last day of its expiry month', () => {
    const info = getExpiryInfo('3/2027', NOW);
    expect(info.isExpired).toBe(false);
    expect(info.isExpiringSoon).toBe(true);
  });

  it('flags a card whose month has passed as expired, not expiring soon', () => {
    const info = getExpiryInfo('2/2027', NOW);
    expect(info.isExpired).toBe(true);
    expect(info.isExpiringSoon).toBe(false);
  });

  it('flags a card within 60 days of expiry as expiring soon', () => {
    expect(getExpiryInfo('4/2027', NOW).isExpiringSoon).toBe(true);
    expect(getExpiryInfo('6/2027', NOW).isExpiringSoon).toBe(false);
  });

  it('returns no date for a missing or unreadable value', () => {
    expect(getExpiryInfo(null, NOW).date).toBeNull();
    expect(getExpiryInfo('13/2027', NOW).date).toBeNull();
    expect(getExpiryInfo('soon', NOW).date).toBeNull();
  });
});

describe('getSepaCreditor', () => {
  it('names the Spanish foundation for ES and the Foundation otherwise', () => {
    expect(getSepaCreditor('es').id).toBe('ES34000G54754031');
    expect(getSepaCreditor('DE').id).toBe('DE94ZZZ00000023303');
    expect(getSepaCreditor(null).id).toBe('DE94ZZZ00000023303');
  });
});

describe('setupIntentIdFromSecret', () => {
  it('takes the id before "_secret_"', () => {
    expect(setupIntentIdFromSecret('seti_123_secret_abc')).toBe('seti_123');
  });
});
