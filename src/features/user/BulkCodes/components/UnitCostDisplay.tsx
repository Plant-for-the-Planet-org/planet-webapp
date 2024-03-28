import { ReactElement } from 'react';
import { useTranslations } from 'next-intl';
import { TextField } from '@mui/material';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
import { CurrencyCode } from '@planet-sdk/common';

interface UnitCostDisplayProps {
  unitCost: number | '-';
  currency: CurrencyCode | '';
  unit: 'tree' | 'm2' | 'ha';
}

const UnitCostDisplay = ({
  unitCost,
  currency,
  unit,
}: UnitCostDisplayProps): ReactElement | null => {
  const t = useTranslations('BulkCodes');

  return (
    <InlineFormDisplayGroup>
      <TextField
        label={t('costPerUnit')}
        value={`${unitCost} ${currency}`}
        inputProps={{ readOnly: true }}
        disabled
      ></TextField>
      <TextField
        label={t('unitOfMeasurement')}
        value={t(`units.${unit}`)}
        inputProps={{ readOnly: true }}
        disabled
      ></TextField>
    </InlineFormDisplayGroup>
  );
};

export default UnitCostDisplay;
