import { TextField, styled } from '@mui/material';
import { ReactElement, useState, FocusEvent } from 'react';
import i18next from '../../../../../i18n';
import { SetState } from '../../../common/Layout/BulkCodeContext';

const { useTranslation } = i18next;

const InlineFormGroup = styled('div')({
  display: 'flex',
  gap: 16,
});

interface GenericCodesProps {
  codeQuantity: string;
  unitsPerCode: string;
  setCodeQuantity: SetState<string>;
  setUnitsPerCode: SetState<string>;
}

const GenericCodesPartial = ({
  codeQuantity,
  unitsPerCode,
  setCodeQuantity,
  setUnitsPerCode,
}: GenericCodesProps): ReactElement | null => {
  const { t, ready } = useTranslation(['common', 'bulkCodes']);
  const [errors, setErrors] = useState({
    unitsPerCode: false,
    codeQuantity: false,
  });

  const handleChange = (value: string, setValue: SetState<string>): void => {
    value = value.replace(/[^0-9]/g, '');
    setValue(value);
  };

  const validateRequiredField = (event: FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    let isError = false;
    if (!value || Number(value) < 0) isError = true;
    setErrors({ ...errors, [name]: isError });
  };

  if (ready) {
    return (
      <InlineFormGroup>
        <TextField
          value={unitsPerCode}
          onChange={(e) => handleChange(e.target.value, setUnitsPerCode)}
          onBlur={validateRequiredField}
          label={t('bulkCodes:unitsPerCode')}
          name="unitsPerCode"
          error={errors.unitsPerCode}
          helperText={errors.unitsPerCode ? t('bulkCodes:unitsRequired') : ''}
        ></TextField>
        <TextField
          value={codeQuantity}
          onChange={(e) => handleChange(e.target.value, setCodeQuantity)}
          onBlur={validateRequiredField}
          label={t('bulkCodes:totalNumberOfCodes')}
          name="codeQuantity"
          error={errors.codeQuantity}
          helperText={
            errors.codeQuantity ? t('bulkCodes:quantityCodesRequired') : ''
          }
        ></TextField>
      </InlineFormGroup>
    );
  }
  return null;
};

export default GenericCodesPartial;
