import { TextField } from '@mui/material';
import { ReactElement } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import getFormatedCurrency from '../../../../utils/countryCurrency/getFormattedCurrency';
import { CurrencyCode } from '@planet-sdk/common';

interface BulkGiftTotalProps {
  amount?: number;
  currency?: CurrencyCode;
  units?: number;
  unit?: 'tree' | 'm2' | 'ha';
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

  const getUnit = (_unit: string, _units?: number) => {
    if (_unit === 'tree') {
      return tCommon('tree', { count: _units });
    } else if (_unit === 'm2') {
      return 'm2';
    } else return 'ha';
  };

  return (
    <TextField
      label={tBulkCodes('total')}
      disabled
      inputProps={{ readOnly: true }}
      value={`${getFormatedCurrency(
        locale,
        currency as string,
        amount
      )} for ${units} ${getUnit(unit, units)}`}
      // TODOO translation and pluralization
    ></TextField>
  );
};

export default BulkGiftTotal;
