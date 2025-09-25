import type { ChangeEvent, ReactElement } from 'react';
import type { APIError, SerializedError } from '@planet-sdk/common';
import type {
  PaymentMethodInterface,
  PlanetCashAccount,
} from '../../../common/types/planetcash';

import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { MenuItem, TextField } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
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
import { usePlanetCash } from '../../../common/Layout/PlanetCashContext';
import CustomModal from '../../../common/Layout/CustomModal';
import getFormattedCurrency from '../../../../utils/countryCurrency/getFormattedCurrency';

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
  const locale = useLocale();
  const { putApiAuthenticated, deleteApiAuthenticated } = useApi();
  const { setErrors } = useContext(ErrorHandlingContext);
  const { updateAccount } = usePlanetCash();

  const [isProcessingDelete, setIsProcessingDelete] = useState(false);
  const [isProcessingSave, setIsProcessingSave] = useState(false);
  const [isDisableConfirmationOpen, setIsDisableConfirmationOpen] =
    useState(false);

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
    setError: setFormError,
    setValue,
    formState: { errors },
  } = useForm<TopUpFormData>({
    mode: 'onBlur',
    defaultValues: defaultTopUpDetails,
  });

  const isAutoRefillEnabled = watch('isAutoRefillEnabled');

  useEffect(() => {
    reset(defaultTopUpDetails);
  }, [defaultTopUpDetails, reset]);

  const handleToggleChange = useCallback(
    async (checked: boolean, onChange: (value: boolean) => void) => {
      if (checked) {
        onChange(checked);
      } else {
        if (!isProcessingDelete) {
          setIsDisableConfirmationOpen(true);
        }
      }
    },
    [isProcessingDelete]
  );

  const handleConfirmDisable = useCallback(async () => {
    setIsDisableConfirmationOpen(false);
    setValue('isAutoRefillEnabled', false);

    if (!account.topUpEnabled) {
      return;
    }

    setIsProcessingDelete(true);

    try {
      const res = await deleteApiAuthenticated<PlanetCashAccount>(
        `/app/planetCash/${account.id}/autoTopUp`
      );
      updateAccount(res);
    } catch (err) {
      console.error('Failed to disable auto top-up:', err);
      setErrors(handleError(err as APIError));
      setValue('isAutoRefillEnabled', true);
    } finally {
      setIsProcessingDelete(false);
    }
  }, [account.id, account.topUpEnabled, deleteApiAuthenticated, setValue]);

  const handleSaveTopUpError = (err: unknown) => {
    console.error('Failed to save top-up settings:', err);
    const serializedErrors = handleError(err as APIError);
    const _serializedErrors: SerializedError[] = [];

    for (const error of serializedErrors) {
      switch (error.message) {
        case 'payment_method_not_found':
          _serializedErrors.push({
            message: tTopUp('apiErrors.paymentMethodNotFound'),
          });
          break;
        case 'top_up_amount_too_low':
          setFormError('topUpAmount', {
            message: tTopUp('apiErrors.topUpAmountTooLow', {
              minAmountWithCurrency: getFormattedCurrency(
                locale,
                account.currency,
                (error.parameters?.min_amount || 0) / 100,
                true
              ),
            }),
          });
          break;
        case 'top_up_threshold_too_low':
          setFormError('topUpThreshold', {
            message: tTopUp('apiErrors.topUpThresholdTooLow', {
              minThresholdWithCurrency: getFormattedCurrency(
                locale,
                account.currency,
                (error.parameters?.min_threshold || 0) / 100,
                true
              ),
            }),
          });
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

  const saveTopUpSettings = useCallback(
    async (data: TopUpFormData) => {
      if (!data.isAutoRefillEnabled || isProcessingSave) {
        return;
      }
      const payload = {
        topUpThreshold: Math.round(parseFloat(data.topUpThreshold) * 100),
        topUpAmount: Math.round(parseFloat(data.topUpAmount) * 100),
        paymentMethod: data.paymentMethod,
      };

      setIsProcessingSave(true);

      try {
        const res = await putApiAuthenticated<PlanetCashAccount>(
          `/app/planetCash/${account.id}/autoTopUp`,
          { payload }
        );
        updateAccount(res);
        // TODO: Show success message
        console.log('Top-up settings saved successfully');
      } catch (err) {
        handleSaveTopUpError(err);
      } finally {
        setIsProcessingSave(false);
      }
    },
    [account.id, isProcessingSave, handleSaveTopUpError, putApiAuthenticated]
  );

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
                  handleToggleChange(checked, onChange);
                }}
                inputProps={{ 'aria-label': 'auto refill toggle' }}
                id="is-refill-enabled"
                disabled={isProcessingDelete}
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
        <CustomModal
          isOpen={isDisableConfirmationOpen}
          handleContinue={handleConfirmDisable}
          handleCancel={() => {
            setIsDisableConfirmationOpen(false);
          }}
          continueButtonText={tTopUp(
            'disableConfirmationDialog.confirmButtonText'
          )}
          cancelButtonText={tTopUp(
            'disableConfirmationDialog.cancelButtonText'
          )}
          modalTitle={tTopUp('disableConfirmationDialog.title')}
          modalSubtitle={tTopUp('disableConfirmationDialog.subtitle')}
        />
      </div>
    </StyledForm>
  );
};

export default TopUpManagement;
