import type { ChangeEvent, ReactElement } from 'react';
import type { APIError, SerializedError } from '@planet-sdk/common';
import type {
  PaymentMethodInterface,
  PlanetCashAccount,
} from '../../../common/types/planetcash';

import { useContext, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { MenuItem, TextField } from '@mui/material';
import { useTranslations } from 'next-intl';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { handleError } from '@planet-sdk/common';
import NewToggleSwitch from '../../../common/InputTypes/NewToggleSwitch';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
import styles from '../PlanetCash.module.scss';
import StyledForm from '../../../common/Layout/StyledForm';
import WebappButton from '../../../common/WebappButton';
import ReactHookFormSelect from '../../../common/InputTypes/ReactHookFormSelect';
import { useApi } from '../../../../hooks/useApi';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';

type TopUpFormData = {
  isAutoRefillEnabled: boolean;
  topUpThreshold: string;
  topUpAmount: string;
  paymentMethod: string;
};

interface TopUpManagementProps {
  account: PlanetCashAccount;
}

const TopUpManagement = ({ account }: TopUpManagementProps): ReactElement => {
  const tTopUp = useTranslations('PlanetCash.topUpManagement');
  const { putApiAuthenticated } = useApi();
  const { setErrors } = useContext(ErrorHandlingContext);

  const defaultTopUpDetails = useMemo(() => {
    const hasExistingTopUp =
      account.topUpThreshold !== null || account.topUpAmount !== null;

    return {
      isAutoRefillEnabled: hasExistingTopUp,
      topUpThreshold:
        account.topUpThreshold !== null
          ? (account.topUpThreshold / 100).toString()
          : '',
      topUpAmount:
        account.topUpAmount !== null
          ? (account.topUpAmount / 100).toString()
          : '',
      paymentMethod: account.paymentMethods[0]?.id || '',
    };
  }, [account]);

  const {
    handleSubmit,
    control,
    reset,
    watch,
    setError,
    formState: { errors },
  } = useForm<TopUpFormData>({
    mode: 'onBlur',
    defaultValues: defaultTopUpDetails,
  });

  const isAutoRefillEnabled = watch('isAutoRefillEnabled');

  useEffect(() => {
    reset(defaultTopUpDetails);
  }, [defaultTopUpDetails, reset]);

  const handleToggleChange = async (checked: boolean) => {
    if (!checked) {
      // Call DELETE API immediately when toggle is turned off
      try {
        // TODO: DELETE /app/planetCash/${account.id}/autoTopUp
        console.log('Disabling auto top-up for account:', account.id);
        // TODO: Show success message and refresh account data
      } catch (error) {
        // TODO: Handle error (show error message)
        console.error('Failed to disable auto top-up:', error);
        // TODO: Revert toggle state on error
      }
    }
    return checked;
  };

  const handleSaveTopUpError = (err: unknown) => {
    console.error('Failed to save top-up settings:', err);
    const serializedErrors = handleError(err as APIError);
    const _serializedErrors: SerializedError[] = [];

    for (const error of serializedErrors) {
      console.dir(error);
      switch (error.message) {
        case 'payment_method_not_found':
          _serializedErrors.push({
            message: tTopUp('apiErrors.paymentMethodNotFound'),
          });
          break;
        case 'field_validation_failed':
          _serializedErrors.push({
            message: tTopUp('apiErrors.fieldValidationFailed'),
          });
          if (error.parameters?.errors) {
            const fieldErrors = error.parameters.errors as Record<
              string,
              string[]
            >;
            for (const fieldName in fieldErrors) {
              const messages = fieldErrors[fieldName];
              if (messages.length > 0) {
                setError(fieldName as keyof TopUpFormData, {
                  type: 'server',
                  message: messages[0],
                });
              }
            }
          }
          break;
        default:
          _serializedErrors.push({
            message: tTopUp('apiErrors.default'),
          });
          _serializedErrors.push(error);
          break;
      }
    }
    setErrors(_serializedErrors);
  };

  const saveTopUpSettings = async (data: TopUpFormData) => {
    if (!data.isAutoRefillEnabled) {
      return;
    }
    const payload = {
      topUpThreshold: Math.round(parseFloat(data.topUpThreshold) * 100),
      topUpAmount: Math.round(parseFloat(data.topUpAmount) * 100),
      paymentMethod: data.paymentMethod,
    };

    try {
      const res = await putApiAuthenticated(
        `/app/planetCash/${account.id}/autoTopUp`,
        { payload }
      );

      // TODO: Show success message and refresh account data
      console.log('Top-up settings saved successfully');
    } catch (err) {
      handleSaveTopUpError(err);
    }
  };

  const formatPaymentMethodInfo = (
    paymentMethod: PaymentMethodInterface
  ): string => {
    switch (paymentMethod.type) {
      case 'sepa_debit':
        return tTopUp('paymentMethodInfo.sepa_debit', {
          last4: paymentMethod.last4,
        });
      case 'card':
        return tTopUp('paymentMethodInfo.card', {
          last4: paymentMethod.last4,
        });
      default:
        return tTopUp('paymentMethodInfo.unknown');
    }
  };

  const getStatusDisplay = (): string => {
    if (account.topUpThreshold !== null && account.topUpAmount !== null) {
      return tTopUp('statusActive');
    }
    return tTopUp('statusInactive');
  };

  const handleIntegerInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  };

  if (!account.paymentMethods || account.paymentMethods.length === 0) {
    return <></>;
  }

  const hasMultiplePaymentMethods = account.paymentMethods.length > 1;

  return (
    <StyledForm>
      <div className="inputContainer">
        <InlineFormDisplayGroup type="other">
          <label
            htmlFor="is-refill-enabled"
            className={styles.refillToggleLabel}
          >
            <AutorenewIcon className={styles.topUpIcon} />
            <span>{tTopUp('labelToggle')}</span>
          </label>
          <Controller
            name="isAutoRefillEnabled"
            control={control}
            render={({ field: { onChange, value } }) => (
              <NewToggleSwitch
                checked={value}
                onChange={(event) => {
                  const checked = event.target.checked;
                  onChange(checked);
                  if (!checked) {
                    handleToggleChange(checked);
                  }
                }}
                inputProps={{ 'aria-label': 'auto refill toggle' }}
                id="is-refill-enabled"
              />
            )}
          />
        </InlineFormDisplayGroup>

        {isAutoRefillEnabled && (
          <>
            <Controller
              name="topUpThreshold"
              control={control}
              rules={{
                required: isAutoRefillEnabled
                  ? tTopUp('validationErrors.thresholdRequired')
                  : false,
                min: {
                  value: 1,
                  message: tTopUp('validationErrors.thresholdMinimum'),
                },
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextField
                  label={`${tTopUp('labelThreshold', {
                    currency: account.currency,
                  })} *`}
                  onChange={(event) => {
                    handleIntegerInputChange(event);
                    onChange(event);
                  }}
                  onBlur={onBlur}
                  value={value}
                  error={errors.topUpThreshold !== undefined}
                  helperText={
                    errors.topUpThreshold !== undefined &&
                    errors.topUpThreshold.message
                  }
                />
              )}
            />
            <Controller
              name="topUpAmount"
              control={control}
              rules={{
                required: isAutoRefillEnabled
                  ? tTopUp('validationErrors.amountRequired')
                  : false,
                min: {
                  value: 1,
                  message: tTopUp('validationErrors.amountMinimum'),
                },
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextField
                  label={`${tTopUp('labelRefillAmount', {
                    currency: account.currency,
                  })} *`}
                  onChange={(event) => {
                    handleIntegerInputChange(event);
                    onChange(event);
                  }}
                  onBlur={onBlur}
                  value={value}
                  error={errors.topUpAmount !== undefined}
                  helperText={
                    errors.topUpAmount !== undefined &&
                    errors.topUpAmount.message
                  }
                />
              )}
            />

            {hasMultiplePaymentMethods && (
              <ReactHookFormSelect
                name="paymentMethod"
                label={`${tTopUp('labelPaymentMethod')} *`}
                control={control}
              >
                {account.paymentMethods.map((method) => (
                  <MenuItem key={method.id} value={method.id}>
                    {formatPaymentMethodInfo(method)}
                  </MenuItem>
                ))}
              </ReactHookFormSelect>
            )}

            <div className={styles.infoRow}>
              {!hasMultiplePaymentMethods && (
                <div className={styles.infoItem}>
                  <h3 className={styles.detailTitle}>
                    {tTopUp('labelPaymentMethod')}
                  </h3>
                  <div className={styles.detailInfo}>
                    {formatPaymentMethodInfo(account.paymentMethods[0])}
                  </div>
                </div>
              )}
              <div className={styles.infoItem}>
                <h3 className={styles.detailTitle}>{tTopUp('labelStatus')}</h3>
                <div className={styles.detailInfo}>{getStatusDisplay()}</div>
              </div>
            </div>
            <WebappButton
              elementType="button"
              variant="primary"
              text={tTopUp('saveButton')}
              onClick={handleSubmit(saveTopUpSettings)}
            />
          </>
        )}
      </div>
    </StyledForm>
  );
};

export default TopUpManagement;
