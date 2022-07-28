import { TextField, styled } from '@mui/material';
import { ReactElement, useState, FocusEvent } from 'react';
import i18next from '../../../../../i18n';
import { SetState } from '../../../common/Layout/BulkCodeContext';
import { BulkCodeLimits } from '../../../../utils/constants/bulkCodeConstants';

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
    unitsPerCode: { status: false, errorType: '' },
    codeQuantity: { status: false, errorType: '' },
  });

  const handleChange = (value: string, setValue: SetState<string>): void => {
    value = value.replace(/[^0-9]/g, '');
    setValue(value);
  };

  const validateRequiredField = (
    event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    maxLimit?: number
  ) => {
    const { name, value } = event.target;
    let isError = false;
    let errorType = '';

    if (!value || Number(value) <= 0) {
      isError = true;
      errorType = `${name}Required`;
    }

    if (maxLimit && Number(value) > maxLimit) {
      isError = true;
      errorType = `${name}InvalidRange`;
    }
    setErrors({
      ...errors,
      [name]: { status: isError, errorType: errorType },
    });
  };

  if (ready) {
    return (
      <InlineFormGroup>
        <TextField
          value={unitsPerCode}
          onChange={(e) => handleChange(e.target.value, setUnitsPerCode)}
          onBlur={(e) =>
            validateRequiredField(e, BulkCodeLimits.MAX_UNITS_PER_CODE)
          }
          label={t('bulkCodes:unitsPerCode')}
          name="unitsPerCode"
          error={errors.unitsPerCode.status}
          helperText={
            errors.unitsPerCode.status
              ? t(`bulkCodes:${errors.unitsPerCode.errorType}`)
              : ''
          }
        ></TextField>
        <TextField
          value={codeQuantity}
          onChange={(e) => handleChange(e.target.value, setCodeQuantity)}
          onBlur={(e) =>
            validateRequiredField(e, BulkCodeLimits.MAX_CODE_QUANTITY)
          }
          label={t('bulkCodes:totalNumberOfCodes')}
          name="codeQuantity"
          error={errors.codeQuantity.status}
          helperText={
            errors.codeQuantity.status
              ? t(`bulkCodes:${errors.codeQuantity.errorType}`)
              : ''
          }
        ></TextField>
      </InlineFormGroup>
    );
  }
  return null;
};

export default GenericCodesPartial;
