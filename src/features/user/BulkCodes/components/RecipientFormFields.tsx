import { TableCell, TextField, MenuItem } from '@mui/material';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { isEmailValid } from '../../../../utils/isEmailValid';
import ReactHookFormSelect from '../../../common/InputTypes/ReactHookFormSelect';
import { Recipient } from '../BulkCodesTypes';

interface Props {
  control: Control<Recipient>;
  errors: FieldErrors<Recipient>;
}

const RecipientFormFields = ({ control, errors }: Props) => {
  const t = useTranslations('BulkCodes');
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
              sx={{ minWidth: 100 }}
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
              sx={{ minWidth: 180 }}
              size="small"
              multiline
              maxRows={3}
              {...field}
            />
          )}
        />
      </TableCell>
    </>
  );
};
export default RecipientFormFields;
