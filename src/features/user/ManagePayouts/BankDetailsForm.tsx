import {
  ChangeEvent,
  ReactElement,
  useCallback,
  useContext,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  TextField,
  MenuItem,
  styled,
  CircularProgress,
} from '@mui/material';
import StyledForm from '../../common/Layout/StyledForm';
import i18n from '../../../../i18n';
import ReactHookFormSelect from './ReactHookFormSelect';
import cleanObject from '../../../utils/cleanObject';
import { postAuthenticatedRequest } from '../../../utils/apiRequests/api';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import { useRouter } from 'next/router';
import CustomSnackbar from '../../common/CustomSnackbar';

const { useTranslation } = i18n;

const InlineFormGroup = styled('div')({
  display: 'flex',
  columnGap: 16,
  rowGap: 24,
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  flexWrap: 'wrap',

  '& .MuiTextField-root': {
    flex: 1,
    minWidth: 240,
  },
});

type FormData = {
  currency: string;
  payoutMinAmount?: number;
  bankName: string;
  bankAddress: string;
  holderName: string;
  holderAddress: string;
  accountNumber: string;
  routingNumber: string;
  bic: string;
  branchCode: string;
  remarks: string;
};

interface Props {
  payoutMinAmounts: { [key: string]: number } | null;
}

const BankDetailsForm = ({ payoutMinAmounts }: Props): ReactElement | null => {
  const { t, ready } = useTranslation('managePayouts');
  const { register, handleSubmit, errors, control, watch } = useForm<FormData>({
    mode: 'onBlur',
  });
  const currency = watch('currency', 'default');
  const { token } = useContext(UserPropsContext);
  const { handleError } = useContext(ErrorHandlingContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAccountCreated, setIsAccountCreated] = useState(false);
  const router = useRouter();

  const handlePayoutChange = (e: ChangeEvent<HTMLInputElement>): void => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  };

  const validateMinPayout = useCallback(
    (value: string): boolean | string | undefined => {
      if (payoutMinAmounts) {
        const minAmount = payoutMinAmounts[currency];
        return (
          parseInt(value) >= minAmount ||
          t('errors.payoutMinAmountTooLow', { currency, minAmount })
        );
      }
    },
    [payoutMinAmounts, currency]
  );

  const onSubmit = async (data: FormData): Promise<void> => {
    setIsProcessing(true);
    const accountData = cleanObject({
      ...data,
      currency: data.currency === 'default' ? '' : data.currency,
      holderType: 'individual', //TODOO - remove this if not needed, or update form if necessary
    });
    const res = await postAuthenticatedRequest(
      '/app/accounts',
      accountData,
      token,
      handleError
    );
    if (res?.id) {
      // show success message
      setIsAccountCreated(true);
      // go to accounts tab
      setTimeout(() => {
        router.push('/profile/payouts');
      }, 3000);
    } else {
      setIsProcessing(false);
      if (res && res['error_type'] === 'account_error') {
        switch (res['error_code']) {
          case 'min_amount_range':
            handleError({
              code: 400,
              message: t(`accountError.${res['error_code']}`, {
                ...res.parameters,
              }),
            });
            break;
          case 'account_duplicate':
            handleError({
              code: 400,
              message: t(`accountError.${res['error_code']}`, {
                currency: res.parameters.currency
                  ? res.parameters.currency
                  : t('defaultCurrency').toLowerCase(),
              }),
            });
            break;
          case 'min_amount_forbidden':
            handleError({
              code: 400,
              message: t(`accountError.${res['error_code']}`),
            });
            break;
          default:
            handleError({
              code: 400,
              message: t(`accountError.default`),
            });
            break;
        }
      }
    }
  };

  const renderCurrencyOptions = useCallback((): ReactElement[] => {
    const currencyOptions = [{ label: t('defaultCurrency'), value: 'default' }];
    if (payoutMinAmounts) {
      Object.keys(payoutMinAmounts).forEach((currency) =>
        currencyOptions.push({ label: currency, value: currency })
      );
    }
    return currencyOptions.map((option, index) => {
      return (
        <MenuItem value={option.value} key={index}>
          {option.label}
        </MenuItem>
      );
    });
  }, [payoutMinAmounts]);

  const closeSnackbar = (): void => {
    setIsAccountCreated(false);
  };

  if (ready) {
    return (
      <>
        <StyledForm onSubmit={handleSubmit(onSubmit)}>
          <div className="inputContainer">
            <ReactHookFormSelect
              name="currency"
              label={t('labels.currency') + '*'}
              control={control}
              helperText={t('helperText.currency')}
              defaultValue={'default'}
            >
              {renderCurrencyOptions()}
            </ReactHookFormSelect>
            {currency !== 'default' && payoutMinAmounts !== null && (
              <TextField
                label={t('labels.payoutMinAmount') + '*'}
                name="payoutMinAmount"
                placeholder={t('placeholders.payoutMinAmount', {
                  currency,
                  minAmount: payoutMinAmounts[currency],
                })}
                onChange={handlePayoutChange}
                inputRef={register({
                  valueAsNumber: true,
                  required: t('errors.payoutMinAmountRequired'),
                  validate: {
                    isLow: validateMinPayout,
                  },
                })}
                error={errors.payoutMinAmount !== undefined}
                helperText={
                  errors.payoutMinAmount && errors.payoutMinAmount.message
                }
              ></TextField>
            )}
            <TextField
              label={t('labels.bankName') + '*'}
              name="bankName"
              inputRef={register({
                required: t('errors.bankNameRequired'),
              })}
              placeholder={t('placeholders.bankName')}
              error={errors.bankName !== undefined}
              helperText={errors.bankName && errors.bankName.message}
            ></TextField>
            <TextField
              multiline
              minRows={2}
              maxRows={4}
              label={t('labels.bankAddress') + '*'}
              name="bankAddress"
              placeholder={t('placeholders.bankAddress')}
              inputRef={register({
                required: t('errors.bankAddressRequired'),
              })}
              error={errors.bankAddress !== undefined}
              helperText={errors.bankAddress && errors.bankAddress.message}
            ></TextField>
            <TextField
              label={t('labels.holderName') + '*'}
              name="holderName"
              placeholder={t('placeholders.holderName')}
              inputRef={register({
                required: t('errors.holderNameRequired'),
              })}
              error={errors.holderName !== undefined}
              helperText={errors.holderName && errors.holderName.message}
            ></TextField>
            <TextField
              multiline
              minRows={2}
              maxRows={4}
              label={t('labels.holderAddress') + '*'}
              name="holderAddress"
              placeholder={t('placeholders.holderAddress')}
              inputRef={register({
                required: t('errors.holderAddressRequired'),
              })}
              error={errors.holderAddress !== undefined}
              helperText={errors.holderAddress && errors.holderAddress.message}
            ></TextField>
            <InlineFormGroup>
              <TextField
                label={t('labels.accountNumber') + '*'}
                name="accountNumber"
                inputRef={register({
                  required: t('errors.accountNumberRequired'),
                })}
                error={errors.accountNumber !== undefined}
                helperText={
                  errors.accountNumber && errors.accountNumber.message
                }
              ></TextField>
              <TextField
                label={t('labels.routingNumber')}
                name="routingNumber"
                inputRef={register}
              ></TextField>
            </InlineFormGroup>
            <InlineFormGroup>
              <TextField
                label={t('labels.bic') + '*'}
                name="bic"
                inputRef={register({
                  required: t('errors.bicRequired'),
                })}
                error={errors.bic !== undefined}
                helperText={errors.bic && errors.bic.message}
              ></TextField>
              <TextField
                label={t('labels.branchCode')}
                name="branchCode"
                inputRef={register}
              ></TextField>
            </InlineFormGroup>
            <TextField
              multiline
              minRows={2}
              maxRows={4}
              label={t('labels.remarks')}
              name="remarks"
              placeholder={t('placeholders.remarks')}
              helperText={t('helperText.remarks')}
              inputRef={register}
            ></TextField>
          </div>
          <Button
            variant="contained"
            color="primary"
            className="formButton"
            type="submit"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <CircularProgress color="primary" size={24} />
            ) : (
              t('saveButton')
            )}
          </Button>
        </StyledForm>
        {isAccountCreated && (
          <CustomSnackbar
            snackbarText={t('accountCreationSuccess')}
            isVisible={isAccountCreated}
            handleClose={closeSnackbar}
          />
        )}
      </>
    );
  }

  return null;
};

export default BankDetailsForm;
