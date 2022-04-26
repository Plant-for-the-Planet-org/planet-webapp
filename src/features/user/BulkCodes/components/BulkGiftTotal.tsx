import { TextField } from 'mui-latest';
import { ReactElement } from 'react';

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
}: BulkGiftTotalProps): ReactElement => {
  return (
    <TextField
      label="Total"
      disabled
      inputProps={{ readOnly: true }}
      value={`${amount} ${currency} for ${units} ${unit}`}
    ></TextField>
  );
};

export default BulkGiftTotal;
