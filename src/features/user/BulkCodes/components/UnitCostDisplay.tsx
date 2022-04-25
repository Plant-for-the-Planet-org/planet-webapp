import { TextField, styled } from 'mui-latest';
import { ReactElement } from 'react';

const UnitCostDisplayGroup = styled('div')({
  display: 'flex',
  gap: 16,
});

interface UnitCostDisplayProps {
  unitCost: number;
  currency: string;
  unit: 'tree' | 'm2' | 'ha';
}

const UnitCostDisplay = ({
  unitCost,
  currency,
  unit,
}: UnitCostDisplayProps): ReactElement => {
  return (
    <UnitCostDisplayGroup className="UnitCostDisplay">
      <TextField
        label="Cost per Unit"
        value={`${unitCost} ${currency}`}
        inputProps={{ readOnly: true }}
        disabled
      ></TextField>
      <TextField
        label="Unit of Measurement"
        value={unit}
        inputProps={{ readOnly: true }}
        disabled
      ></TextField>
    </UnitCostDisplayGroup>
  );
};

export default UnitCostDisplay;
