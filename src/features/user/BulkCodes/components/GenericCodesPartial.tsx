import { TextField, styled } from '@mui/material';
import { ReactElement } from 'react';
import i18next from '../../../../../i18n';
import { SetState } from '../../../common/Layout/BulkCodeContext';

const { useTranslation } = i18next;

const InlineFormGroup = styled('div')({
  display: 'flex',
  gap: 16,
});

interface GenericCodesProps {
  codeQuantity: string;
  unit: string;
  occasion: string;
  setCodeQuantity: SetState<string>;
  setUnit: SetState<string>;
  setOccasion: SetState<string>;
}

const GenericCodesPartial = ({
  codeQuantity,
  unit,
  occasion,
  setCodeQuantity,
  setUnit,
  setOccasion,
}: GenericCodesProps): ReactElement | null => {
  const { t, ready } = useTranslation(['common', 'bulkCodes']);
  if (ready) {
    return (
      <>
        <InlineFormGroup>
          <TextField
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            label={t('bulkCodes:unitsPerCode')}
          ></TextField>
          <TextField
            value={codeQuantity}
            onChange={(e) => setCodeQuantity(e.target.value)}
            label={t('bulkCodes:totalNumberOfCodes')}
          ></TextField>
        </InlineFormGroup>
        <TextField
          value={occasion}
          onChange={(e) => setOccasion(e.target.value)}
          label={t('bulkCodes:occasion')}
        ></TextField>
      </>
    );
  }
  return null;
};

export default GenericCodesPartial;
