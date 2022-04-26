import { TextField } from 'mui-latest';
import { ReactElement } from 'react';
import i18next from '../../../../../i18n';

const { useTranslation } = i18next;

interface BulkGiftTotalProps {
  amount: number;
  currency: string;
  units: number;
  unit: 'tree' | 'm2' | 'ha';
}

const BulkGiftTotal = ({
  amount = 0,
  currency = 'USD',
  units = 0,
  unit = 'tree',
}: BulkGiftTotalProps): ReactElement | null => {
  const { t, ready } = useTranslation(['common', 'bulkCodes']);

  if (ready) {
    return (
      <TextField
        label={t('bulkCodes:total')}
        disabled
        inputProps={{ readOnly: true }}
        value={`${amount} ${currency} for ${units} ${unit}`}
        // TODOO translation and pluralization
      ></TextField>
    );
  }
  return null;
};

export default BulkGiftTotal;
