import { TextField } from '@mui/material';
import { ReactElement } from 'react';
import { useTranslation } from 'next-i18next';
import getFormatedCurrency from '../../../../utils/countryCurrency/getFormattedCurrency';

interface BulkGiftTotalProps {
  amount?: number;
  currency?: string;
  units?: number;
  unit?: string;
  isImport?: boolean;
}

const BulkGiftTotal = ({
  amount = 0,
  currency,
  units = 0,
  unit = 'tree',
  isImport = false,
}: BulkGiftTotalProps): ReactElement | null => {
  const { t, ready, i18n } = useTranslation(['common', 'bulkCodes']);

  const getUnit = (_unit: string, _units?: number) => {
    if (_unit === 'tree') {
      return t('common:tree', { count: _units });
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
        helperText={
          <>
            {t('bulkCodes:chargeConsentText')}
            {isImport && (
              <>
                <br />
                {t('bulkCodes:invalidEmailWarningText')}
              </>
            )}
          </>
        }
        // TODOO translation and pluralization
      ></TextField>
    );
  }
  return null;
};

export default BulkGiftTotal;
