import { TextField, styled } from 'mui-latest';
import { ReactElement } from 'react';
import i18next from '../../../../../i18n';

const { useTranslation } = i18next;

const InlineFormGroup = styled('div')({
  display: 'flex',
  gap: 16,
});

interface GenericCodesProps {}

const GenericCodesPartial = ({}: GenericCodesProps): ReactElement | null => {
  const { t, ready } = useTranslation(['common', 'bulkCodes']);
  if (ready) {
    return (
      <>
        <InlineFormGroup>
          <TextField label={t('bulkCodes:unitsPerCode')}></TextField>
          <TextField label={t('bulkCodes:totalNumberOfCodes')}></TextField>
        </InlineFormGroup>
        <TextField label={t('bulkCodes:occasion')}></TextField>
      </>
    );
  }
  return null;
};

export default GenericCodesPartial;
