import { TextField } from '@mui/material';
import { ReactElement } from 'react';
import i18next from '../../../../../i18n';
import getFormatedCurrency from '../../../../utils/countryCurrency/getFormattedCurrency';

const { useTranslation } = i18next;

interface BulkGiftTotalProps {
  amount?: number;
  currency?: string;
  units?: number;
  unit?: string;
}

const BulkGiftTotal = ({
  amount = 0,
  currency,
  units = 0,
  unit = 'tree',
}: BulkGiftTotalProps): ReactElement | null => {
  const { t, ready, i18n } = useTranslation(['common', 'bulkCodes']);

  const getUnit = (_unit: string, _units?: number) => {
    if (_unit === 'tree') {
      if (_units) {
        if (_units === 1) {
          return t('common:tree');
        } else return t('common:tree_plural');
      } else return _unit;
    } else if (_unit === 'm2') {
      return 'm2';
    } else return 'ha';
  };

  if (ready) {
    return (
      <TextField
        label={t('bulkCodes:total')}
        disabled
        inputProps={{ readOnly: true }}
        value={`${getFormatedCurrency(
          i18n.language,
          currency as string,
          amount
        )} for ${units} ${getUnit(unit, units)}`}
        helperText={t('bulkCodes:chargeConsentText')}
        // TODOO translation and pluralization
      ></TextField>
    );
  }
  return null;
};

export default BulkGiftTotal;
