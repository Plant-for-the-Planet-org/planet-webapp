import { TableRow, TableCell, IconButton } from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { SetState } from '../../../common/types/common';
import themeProperties from '../../../../theme/themeProperties';
import { Recipient } from '../BulkCodesTypes';
import AddIcon from '../../../../../public/assets/images/icons/AddIcon';
import RecipientFormFields from './RecipientFormFields';
import ActionContainer from './ActionContainer';

interface Props {
  setLocalRecipients: SetState<Recipient[]>;
  setIsAddingRecipient: SetState<boolean>;
  afterSaveCallback: () => void;
}

const AddRecipient = ({
  setLocalRecipients,
  setIsAddingRecipient,
  afterSaveCallback,
}: Props) => {
  const t = useTranslations('BulkCodes');
  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
    reset,
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

  const hasErrors = Object.keys(errors).length > 0;

  const handleSave = (newRecipient: Recipient): void => {
    setLocalRecipients((currentRecipients) => [
      newRecipient,
      ...currentRecipients,
    ]);
    reset();
    afterSaveCallback();
  };

  useEffect(() => {
    setIsAddingRecipient(Object.keys(dirtyFields).length !== 0);
    return () => {
      setIsAddingRecipient(false);
    };
  }, [Object.keys(dirtyFields).length]);

  return (
    <>
      <TableRow sx={hasErrors ? { verticalAlign: 'top' } : {}}>
        {/* Actions */}
        <TableCell align="center">
          <form
            style={{ display: 'inline' }}
            onSubmit={handleSubmit(handleSave)}
          >
            <ActionContainer>
              <IconButton
                size="medium"
                type="submit"
                aria-label="add a recipient"
                title={t('titleAddRecipientButton')}
                color="primary"
              >
                <AddIcon color={themeProperties.primaryColor} />
              </IconButton>
            </ActionContainer>
          </form>
        </TableCell>
        <RecipientFormFields control={control} errors={errors} />
      </TableRow>
      {/* <DevTool control={control} /> */}
    </>
  );
};

export default AddRecipient;
