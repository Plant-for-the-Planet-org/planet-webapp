import { TableRow, TableCell, TextField, MenuItem } from '@mui/material';
import { useForm } from 'react-hook-form';
import ReactHookFormSelect from '../../../common/InputTypes/ReactHookFormSelect';
import { Recipient, TableHeader } from '../BulkCodesTypes';

interface Props {
  handleSave: () => void;
  headers: TableHeader[];
}

const NewRow = ({ handleSave, headers }: Props) => {
  const { register, control } = useForm<Recipient>({
    mode: 'onBlur',
  });
  return (
    <TableRow>
      <TableCell>
        <TextField size="small" name="recipient_name" inputRef={register} />
      </TableCell>
      <TableCell>
        <TextField size="small" name="recipient_email" inputRef={register} />
      </TableCell>
      <TableCell>
        {/* <TextField
          select
          size="small"
          name="recipient_notify"
          defaultValue="no"
          inputRef={register}
          sx={{ width: 75 }}
        >
          <MenuItem key="no" value="no">
            No
          </MenuItem>
          <MenuItem key="yes" value="yes">
            Yes
          </MenuItem>
        </TextField> */}
        <ReactHookFormSelect
          name="recipient_notify"
          label=""
          control={control}
          defaultValue="no"
          size="small"
        >
          <MenuItem key="no" value="no">
            No
          </MenuItem>
          <MenuItem key="yes" value="yes">
            Yes
          </MenuItem>
        </ReactHookFormSelect>
      </TableCell>
      <TableCell>
        <TextField
          size="small"
          name="units"
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          inputRef={register({ required: true })}
        />
      </TableCell>
      <TableCell>
        <TextField
          sx={{ minWidth: 200 }}
          size="small"
          multiline
          maxRows={3}
          name="recipient_message"
          inputRef={register}
        />
      </TableCell>
    </TableRow>
  );
};
export default NewRow;
