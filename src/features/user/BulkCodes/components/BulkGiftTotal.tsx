import type { ReactElement } from 'react';
import type { CurrencyCode, UnitTypes } from '@planet-sdk/common';

import { useMemo } from 'react';
import { TextField } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import getFormattedCurrency from '../../../../utils/countryCurrency/getFormattedCurrency';

interface BulkGiftTotalProps {
  amount?: number;
  currency?: CurrencyCode;
  units?: number;
  unitType?: UnitTypes;
}

const BulkGiftTotal = ({
  amount = 0,
  currency,
  units = 0,
  unitType,
}: BulkGiftTotalProps): ReactElement | null => {
  const tCommon = useTranslations('Common');
  const tBulkCodes = useTranslations('BulkCodes');
  const locale = useLocale();

  const getPluralizedUnitType = (unitType: UnitTypes, units: number) => {
    switch (unitType) {
      case 'tree':
        return tCommon('tree', { count: units });
      case 'm2':
        return tCommon('m2');
      default:
        return '';
    }
  };

  const displayedTotal = useMemo(() => {
    if (!unitType || !currency || amount < 0 || units < 0) return '';

    try {
      const formattedAmount = getFormattedCurrency(locale, currency, amount);
      if (unitType === 'currency') return formattedAmount;

      return tBulkCodes('summaryTotal', {
        formattedAmount,
        units,
        pluralizedUnitType: getPluralizedUnitType(unitType, units),
      });
    } catch (error) {
      console.error('Error formatting currency:', error);
      return '';
    }
  }, [locale, currency, amount, unitType, units]);

  return (
    <TextField
      label={tBulkCodes('total')}
      disabled
      inputProps={{ 'aria-label': tBulkCodes('total') }}
      value={displayedTotal}
    />
  );
};

export default BulkGiftTotal;
