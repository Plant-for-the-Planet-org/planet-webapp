import {
  TableRow,
  TableCell,
  TextField,
  MenuItem,
  IconButton,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import ReactHookFormSelect from '../../../common/InputTypes/ReactHookFormSelect';
import { Recipient, TableHeader } from '../BulkCodesTypes';
import PlusIcon from '../../../../../public/assets/images/icons/PlusIcon';
import themeProperties from '../../../../theme/themeProperties';

interface Props {
  handleSave: () => void;
  headers: TableHeader[];
}

const NewRow = ({ handleSave, headers }: Props) => {
  const { control } = useForm<Recipient>({
    mode: 'onBlur',
  });
  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            size="small"
            onClick={handleSave}
            aria-label="add a recipient"
            title="Add recipient to table" //TODO - translation
            color="primary"
          >
            <PlusIcon color={themeProperties.primaryColor} />
          </IconButton>
        </TableCell>
        <TableCell>
          <Controller
            name="recipient_name"
            control={control}
            render={() => <TextField size="small" />}
          />
        </TableCell>
        <TableCell>
          <Controller
            name="recipient_email"
            control={control}
            render={() => <TextField size="small" />}
          />
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
          <Controller
            name="units"
            control={control}
            rules={{ required: true }}
            render={() => (
              <TextField
                size="small"
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              />
            )}
          />
        </TableCell>
        <TableCell>
          <Controller
            name="recipient_message"
            control={control}
            render={() => (
              <TextField
                sx={{ minWidth: 200 }}
                size="small"
                multiline
                maxRows={3}
              />
            )}
          />
        </TableCell>
      </TableRow>
      <DevTool control={control} />
    </>
  );
};
export default NewRow;
