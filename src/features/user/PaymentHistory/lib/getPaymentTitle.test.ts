import type { PaymentListLineItem } from '../types';
import type { PaymentTitleLabels } from './getPaymentTitle';

import { describe, expect, it } from 'vitest';

import { getPaymentTitle } from './getPaymentTitle';

const PURPOSES: Record<string, string> = {
  trees: 'Trees',
  funds: 'Donation',
  membership: 'Membership',
  academy: 'Academy',
  conservation: 'Conservation',
  'planet-cash': 'PlanetCash',
};

const labels: PaymentTitleLabels = {
  purpose: (purpose) => PURPOSES[purpose ?? ''] ?? 'Donation',
  units: (units, unitType) =>
    unitType === 'tree' ? `${units} Trees` : `${units} m²`,
  withSupport: (title) => `${title} + support`,
  list: (parts) => new Intl.ListFormat('en').format(parts),
};

const line = (
  purpose: string,
  caption: string | null,
  units: number | null = null,
  unitType: string | null = 'currency'
): PaymentListLineItem => ({ purpose, caption, units, unitType, amount: 5 });

const title = (purpose: string | null, lineItems: PaymentListLineItem[]) =>
  getPaymentTitle({ purpose, lineItems }, labels);

describe('getPaymentTitle', () => {
  it('names units and project for a tree donation', () => {
    expect(title('trees', [line('trees', 'Plant-for-Ghana', 50, 'tree')])).toBe(
      '50 Trees • Plant-for-Ghana'
    );
  });

  it('names units for an m² donation', () => {
    expect(
      title('conservation', [line('conservation', 'Sumatra', 120, 'm2')])
    ).toBe('120 m² • Sumatra');
  });

  it('names the purpose for a donation that is not counted in units', () => {
    expect(title('membership', [line('membership', 'Donor-Circle')])).toBe(
      'Membership • Donor-Circle'
    );
  });

  it('does not repeat a purpose the caption already names', () => {
    expect(
      title('planet-cash', [line('planet-cash', 'PlanetCash - Jane Doe')])
    ).toBe('PlanetCash - Jane Doe');
  });

  it('falls back to the purpose when there is no caption', () => {
    expect(title('academy', [line('academy', null)])).toBe('Academy');
  });

  it('titles a single line by its own purpose even if the donation says composite', () => {
    expect(title('composite', [line('trees', 'Yucatán', 5, 'tree')])).toBe(
      '5 Trees • Yucatán'
    );
  });

  it('titles a mixed donation by its trees, plus support', () => {
    expect(
      title('composite', [
        line('funds', 'Support Plant-for-the-Planet'),
        line('trees', 'Plant-for-Ghana', 30, 'tree'),
      ])
    ).toBe('30 Trees + support • Plant-for-Ghana');
  });

  it('names only the kinds of purpose for other multi-line donations, funds last', () => {
    expect(
      title('composite', [
        line('funds', 'Support Plant-for-the-Planet'),
        line('trees', 'Plant-for-Ghana', 2, 'tree'),
        line('trees', 'Yucatán', 3, 'tree'),
      ])
    ).toBe('Trees and Donation');
    expect(
      title('composite', [
        line('trees', 'Plant-for-Ghana', 2, 'tree'),
        line('academy', 'Empowerment'),
        line('funds', 'Support'),
      ])
    ).toBe('Trees, Academy, and Donation');
  });

  it('uses the donation purpose when there are no line items', () => {
    expect(title('membership', [])).toBe('Membership');
  });
});
