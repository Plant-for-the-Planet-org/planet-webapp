import { TextField } from 'mui-latest';
import { ReactElement } from 'react';
import i18next from '../../../../../i18n';

const { useTranslation } = i18next;

interface BulkGiftTotalProps {
  amount?: number;
  currency?: string;
  units?: number;
  unit?: string;
}

const BulkGiftTotal = ({
  amount,
  currency,
  units,
  unit,
}: BulkGiftTotalProps): ReactElement | null => {
  const { t, ready } = useTranslation(['common', 'bulkCodes']);

  if (ready) {
    return (
      <TextField
        label={t('bulkCodes:total')}
        disabled
        inputProps={{ readOnly: true }}
        value={`${amount} ${currency} for ${units} ${unit}`}
        helperText={t('bulkCodes:chargeConsentText')}
        // TODOO translation and pluralization
      ></TextField>
    );
  }
  return null;
};

export default BulkGiftTotal;
