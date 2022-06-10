import { ReactElement } from 'react';
import { TextField, styled } from '@mui/material';
import i18next from '../../../../../i18n';

const { useTranslation } = i18next;

const UnitCostDisplayGroup = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  columnGap: '10px',
});

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
      <UnitCostDisplayGroup className="UnitCostDisplay">
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
      </UnitCostDisplayGroup>
    );
  }
  return null;
};

export default UnitCostDisplay;
