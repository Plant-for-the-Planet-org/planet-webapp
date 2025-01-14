import type { ReactElement, FocusEvent } from 'react';
import type { SetState } from '../../../common/Layout/BulkCodeContext';

import { TextField } from '@mui/material';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { BulkCodeLimits } from '../../../../utils/constants/bulkCodeConstants';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';

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
  const t = useTranslations('BulkCodes');
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

  return (
    <InlineFormDisplayGroup>
      <TextField
        value={unitsPerCode}
        onChange={(e) => handleChange(e.target.value, setUnitsPerCode)}
        onBlur={(e) =>
          validateRequiredField(e, BulkCodeLimits.MAX_UNITS_PER_CODE)
        }
        label={t('unitsPerCode')}
        name="unitsPerCode"
        error={errors.unitsPerCode.status}
        helperText={
          errors.unitsPerCode.status ? t(errors.unitsPerCode.errorType) : ''
        }
      ></TextField>
      <TextField
        value={codeQuantity}
        onChange={(e) => handleChange(e.target.value, setCodeQuantity)}
        onBlur={(e) =>
          validateRequiredField(e, BulkCodeLimits.MAX_CODE_QUANTITY)
        }
        label={t('totalNumberOfCodes')}
        name="codeQuantity"
        error={errors.codeQuantity.status}
        helperText={
          errors.codeQuantity.status ? t(errors.codeQuantity.errorType) : ''
        }
      ></TextField>
    </InlineFormDisplayGroup>
  );
};

export default GenericCodesPartial;
