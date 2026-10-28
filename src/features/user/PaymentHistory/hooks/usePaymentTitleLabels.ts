import type { PaymentTitleLabels } from '../lib/getPaymentTitle';

import { useLocale, useTranslations } from 'next-intl';

import { getFormattedNumber } from '@/utils/getFormattedNumber';

/**
 * The words a payment title is built from, shared by the list rows and the
 * detail view so both name a payment the same way.
 */
export const usePaymentTitleLabels = (): PaymentTitleLabels => {
  const t = useTranslations('Me');
  const tPayments = useTranslations('Payments');
  const tCommon = useTranslations('Common');
  const locale = useLocale();

  // Literal keys, so next-intl's typed messages hold; an unknown purpose reads
  // as a plain donation.
  const purposeLabels: Record<string, string> = {
    trees: tPayments('purposes.trees'),
    conservation: tPayments('purposes.conservation'),
    restoration: tPayments('purposes.restoration'),
    funds: tPayments('purposes.funds'),
    membership: tPayments('purposes.membership'),
    academy: tPayments('purposes.academy'),
    'planet-cash': tPayments('purposes.planet-cash'),
    sponsorship: tPayments('purposes.sponsorship'),
    endowment: tPayments('purposes.endowment'),
    'forest-protection': tPayments('purposes.forest-protection'),
    bouquet: tPayments('purposes.bouquet'),
  };

  return {
    purpose: (purpose) => purposeLabels[purpose ?? ''] ?? t('donation'),
    units: (units, unitType) =>
      tCommon(`unitTypes.${unitType}`, {
        count: units,
        formattedCount: getFormattedNumber(locale, units),
      }),
    withSupport: (label) => tPayments('withSupport', { label }),
    list: (labels) =>
      new Intl.ListFormat(locale, { type: 'conjunction' }).format(labels),
  };
};
