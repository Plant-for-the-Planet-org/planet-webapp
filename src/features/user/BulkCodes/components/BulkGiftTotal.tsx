import type { ReactElement } from 'react';
import type { CurrencyCode } from '@planet-sdk/common';
import type { UnitType } from '../../../common/types/project';

import { TextField } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import getFormattedCurrency from '../../../../utils/countryCurrency/getFormattedCurrency';

interface BulkGiftTotalProps {
  amount?: number;
  currency?: CurrencyCode;
  units?: number;
  unit?: UnitType;
}

const BulkGiftTotal = ({
  amount = 0,
  currency,
  units = 0,
  unit = 'tree',
}: BulkGiftTotalProps): ReactElement | null => {
  const tCommon = useTranslations('Common');
  const tBulkCodes = useTranslations('BulkCodes');
  const locale = useLocale();

  const getPluralizedUnitType = (unit: UnitType, units: number) => {
    switch (unit) {
      case 'tree':
        return tCommon('tree', { count: units });
      case 'm2':
        return tCommon('m2');
      default:
        return unit;
    }
  };

  return (
    <TextField
      label={tBulkCodes('total')}
      disabled
      inputProps={{ readOnly: true }}
      value={tBulkCodes('summaryTotal', {
        formattedAmount: getFormattedCurrency(
          locale,
          currency as string,
          amount
        ),
        units,
        pluralizedUnitType: getPluralizedUnitType(unit, units),
      })}
    ></TextField>
  );
};

export default BulkGiftTotal;
