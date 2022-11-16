import { ReactElement } from 'react';
import { useTranslation } from 'next-i18next';
import { TextField } from '@mui/material';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';

interface UnitCostDisplayProps {
  unitCost: number | '-';
  currency: string;
  unit: string;
}

const UnitCostDisplay = ({
  unitCost,
  currency,
  unit,
}: UnitCostDisplayProps): ReactElement | null => {
  const { t, ready } = useTranslation(['bulkCodes']);

  if (ready) {
    return (
      <InlineFormDisplayGroup>
        <TextField
          label={t('bulkCodes:costPerUnit')}
          value={`${unitCost} ${currency}`}
          inputProps={{ readOnly: true }}
          disabled
        ></TextField>
        <TextField
          label={t('bulkCodes:unitOfMeasurement')}
          value={t(`bulkCodes:units.${unit}`)}
          inputProps={{ readOnly: true }}
          disabled
        ></TextField>
      </InlineFormDisplayGroup>
    );
  }
  return null;
};

export default UnitCostDisplay;
