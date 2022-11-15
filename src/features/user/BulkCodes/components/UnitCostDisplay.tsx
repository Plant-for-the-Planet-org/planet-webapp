import { ReactElement } from 'react';
import { TextField } from '@mui/material';
import i18next from '../../../../../i18n';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';

const { useTranslation } = i18next;

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
