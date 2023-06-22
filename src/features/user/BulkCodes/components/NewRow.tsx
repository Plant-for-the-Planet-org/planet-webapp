import {
  TableRow,
  TableCell,
  TextField,
  MenuItem,
  IconButton,
  Box,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import ReactHookFormSelect from '../../../common/InputTypes/ReactHookFormSelect';
import { Recipient, TableHeader } from '../BulkCodesTypes';
import PlusIcon from '../../../../../public/assets/images/icons/PlusIcon';
import themeProperties from '../../../../theme/themeProperties';
import { isEmailValid } from '../../../../utils/isEmailValid';

interface Props {
  handleSave: () => void;
  headers: TableHeader[];
}

const NewRow = ({ handleSave, headers }: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Recipient>({
    mode: 'onBlur',
    defaultValues: {
      recipient_name: '',
      recipient_email: '',
      recipient_notify: 'no',
      units: '',
      recipient_message: '',
    },
  });
  console.log(errors);

  return (
    <>
      <TableRow
        sx={Object.keys(errors).length > 0 ? { verticalAlign: 'top' } : {}}
      >
        <TableCell>
          <form onSubmit={handleSubmit(handleSave)}>
            <Box
              sx={{
                height: 40,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <IconButton
                size="small"
                type="submit"
                aria-label="add a recipient"
                title="Add recipient to table" //TODO - translation
                color="primary"
              >
                <PlusIcon color={themeProperties.primaryColor} />
              </IconButton>
            </Box>
          </form>
        </TableCell>
        <TableCell>
          <Controller
            name="recipient_name"
            control={control}
            rules={{
              validate: (value, formValues) =>
                !(
                  formValues.recipient_notify === 'yes' && value.length === 0
                ) || 'Name is needed to email recipients',
            }}
            render={({ field }) => (
              <TextField
                size="small"
                {...field}
                error={errors.recipient_name !== undefined}
                helperText={errors.recipient_name?.message}
              />
            )}
          />
        </TableCell>
        <TableCell>
          <Controller
            name="recipient_email"
            control={control}
            rules={{
              validate: {
                isRequired: (value, formValues) =>
                  !(
                    formValues.recipient_notify === 'yes' && value.length === 0
                  ) || 'Email is needed to notify recipients',
                isInvalid: (value) =>
                  value.length === 0 ||
                  isEmailValid(value) ||
                  'Invalid email entered',
              },
            }}
            render={({ field }) => (
              <TextField
                size="small"
                {...field}
                error={errors.recipient_email !== undefined}
                helperText={errors.recipient_email?.message}
              />
            )}
          />
        </TableCell>
        <TableCell>
          <ReactHookFormSelect
            name="recipient_notify"
            label=""
            control={control}
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
            rules={{ required: 'Mandatory' }}
            render={({ field: { onChange, ..._field } }) => (
              <TextField
                size="small"
                {..._field}
                onChange={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                  onChange(e.target.value);
                }}
                error={errors.units !== undefined}
                helperText={errors.units?.message}
              />
            )}
          />
        </TableCell>
        <TableCell>
          <Controller
            name="recipient_message"
            control={control}
            render={({ field }) => (
              <TextField
                sx={{ minWidth: 200 }}
                size="small"
                multiline
                maxRows={3}
                {...field}
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
