import {
  TableRow,
  TableCell,
  TextField,
  MenuItem,
  IconButton,
  Box,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { DevTool } from '@hookform/devtools';
import ReactHookFormSelect from '../../../common/InputTypes/ReactHookFormSelect';
import { Recipient } from '../BulkCodesTypes';
import themeProperties from '../../../../theme/themeProperties';
import { isEmailValid } from '../../../../utils/isEmailValid';
import AcceptIcon from '../../../../../public/assets/images/icons/AcceptIcon';
import RejectIcon from '../../../../../public/assets/images/icons/RejectIcon';

interface Props {
  recipient: Recipient;
  updateRecipient: (updatedRecipient: Recipient) => void;
  exitEditMode: () => void;
}

const UpdateRecipient = ({
  recipient,
  updateRecipient,
  exitEditMode,
}: Props) => {
  const { t } = useTranslation('bulkCodes');
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Recipient>({
    mode: 'onBlur',
    defaultValues: recipient,
  });

  const hasErrors = Object.keys(errors).length > 0;

  const handleUpdate = (updatedRecipient: Recipient): void => {
    updateRecipient(updatedRecipient);
    reset();
  };

  const validateRequiredIfNotify = (
    value: string,
    formValues: Recipient
  ): string | true => {
    return formValues.recipient_notify === 'yes' && value.length === 0
      ? t('errorAddRecipient.requiredForNotifications')
      : true;
  };

  return (
    <>
      <TableRow sx={hasErrors ? { verticalAlign: 'top' } : {}}>
        <TableCell align="center" sx={{ minWidth: '80px' }}>
          <form
            style={{ display: 'inline' }}
            onSubmit={handleSubmit(handleUpdate)}
          >
            <Box
              sx={{
                height: 40,
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '0 3px',
              }}
            >
              <IconButton
                size="small"
                aria-label="save edited recipient"
                title="Save Recipient"
                color="primary"
                type="submit"
              >
                <AcceptIcon color={themeProperties.primaryColor} />
              </IconButton>
            </Box>
          </form>
          <Box
            sx={{
              height: 40,
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0 3px',
            }}
          >
            <IconButton
              size="small"
              aria-label="cancel"
              title="Cancel"
              color="primary"
              onClick={exitEditMode}
            >
              <RejectIcon color={themeProperties.primaryColor} />
            </IconButton>
          </Box>
        </TableCell>
        <TableCell>
          <Controller
            name="recipient_name"
            control={control}
            rules={{
              validate: {
                requiredForNotifications: validateRequiredIfNotify,
              },
            }}
            render={({ field }) => (
              <TextField
                sx={{ minWidth: 100 }}
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
                requiredForNotifications: validateRequiredIfNotify,
                emailInvalid: (value) =>
                  value.length === 0 ||
                  isEmailValid(value) ||
                  t('errorAddRecipient.emailInvalid'),
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
              {t('notifyRecipientOptions.no')}
            </MenuItem>
            <MenuItem key="yes" value="yes">
              {t('notifyRecipientOptions.yes')}
            </MenuItem>
          </ReactHookFormSelect>
        </TableCell>
        <TableCell>
          <Controller
            name="units"
            control={control}
            rules={{ required: t('errorAddRecipient.unitsNotProvided') }}
            render={({ field: { onChange, ..._field } }) => (
              <TextField
                sx={{ minWidth: 50 }}
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

export default UpdateRecipient;
