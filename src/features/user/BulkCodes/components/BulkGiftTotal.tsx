import { TextField } from 'mui-latest';
import { ReactElement } from 'react';
import i18next from '../../../../../i18n';

const { useTranslation } = i18next;

interface BulkGiftTotalProps {
  amount?: number;
  currency?: string;
  units?: number;
  unit: string;
}

const BulkGiftTotal = ({
  amount,
  currency,
  units,
  unit,
}: BulkGiftTotalProps): ReactElement | null => {
  const { t, ready } = useTranslation(['common', 'bulkCodes']);

  const getUnit = (_unit: string, _units?: number) => {
    if (_unit === 'tree') {
      if (_units) {
        if (_units > 1) {
          return t('common:tree_plural');
        } else return t('common:tree');
      } else return _unit;
    } else return _unit;
  };

  if (ready) {
    return (
      <TextField
        label={t('bulkCodes:total')}
        disabled
        inputProps={{ readOnly: true }}
        value={`${amount} ${currency} for ${units} ${getUnit(unit, units)}`}
        helperText={t('bulkCodes:chargeConsentText')}
        // TODOO translation and pluralization
      ></TextField>
    );
  }
  return null;
};

export default BulkGiftTotal;
