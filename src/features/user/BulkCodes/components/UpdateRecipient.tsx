import { TableRow, TableCell, IconButton } from '@mui/material';
import { useForm } from 'react-hook-form';
// import { DevTool } from '@hookform/devtools';
import themeProperties from '../../../../theme/themeProperties';
import { Recipient } from '../BulkCodesTypes';
import AcceptIcon from '../../../../../public/assets/images/icons/AcceptIcon';
import RejectIcon from '../../../../../public/assets/images/icons/RejectIcon';
import RecipientFormFields from './RecipientFormFields';
import ActionContainer from './ActionContainer';

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

  return (
    <>
      <TableRow sx={hasErrors ? { verticalAlign: 'top' } : {}}>
        {/* Actions */}
        <TableCell align="center" sx={{ minWidth: '80px' }}>
          <form
            style={{ display: 'inline' }}
            onSubmit={handleSubmit(handleUpdate)}
          >
            <ActionContainer>
              <IconButton
                size="small"
                aria-label="save edited recipient"
                title="Save Recipient"
                color="primary"
                type="submit"
              >
                <AcceptIcon color={themeProperties.primaryColor} />
              </IconButton>
            </ActionContainer>
          </form>
          <ActionContainer>
            <IconButton
              size="small"
              aria-label="cancel"
              title="Cancel"
              color="primary"
              onClick={exitEditMode}
            >
              <RejectIcon color={themeProperties.primaryColor} />
            </IconButton>
          </ActionContainer>
        </TableCell>
        <RecipientFormFields control={control} errors={errors} />
      </TableRow>
      {/* <DevTool control={control} /> */}
    </>
  );
};

export default UpdateRecipient;
