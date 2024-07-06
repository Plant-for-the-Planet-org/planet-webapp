import React, {
  FormEvent,
  ReactElement,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Button, TextField, MenuItem } from '@mui/material';
import styles from '../../../../../src/features/user/BulkCodes/BulkCodes.module.scss';
import { useRouter } from 'next/router';
import ProjectSelector from '../components/ProjectSelector';
import BulkGiftTotal from '../components/BulkGiftTotal';
import RecipientsUploadForm from '../components/RecipientsUploadForm';
import GenericCodesPartial from '../components/GenericCodesPartial';
import BulkCodesError from '../components/BulkCodesError';
import { useBulkCode, Recipient } from '../../../common/Layout/BulkCodeContext';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import cleanObject from '../../../../utils/cleanObject';
import { postAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { useAuth0 } from '@auth0/auth0-react';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { v4 as uuidv4 } from 'uuid';
import { BulkCodeMethods } from '../../../../utils/constants/bulkCodeConstants';
import getFormatedCurrency from '../../../../utils/countryCurrency/getFormattedCurrency';
import { Recipient as LocalRecipient } from '../BulkCodesTypes';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import StyledFormContainer from '../../../common/Layout/StyledFormContainer';
import {
  handleError,
  APIError,
  SerializedError,
  Donation,
} from '@planet-sdk/common';
import { useTenant } from '../../../common/Layout/TenantContext';

const IssueCodesForm = (): ReactElement | null => {
  const t = useTranslations('BulkCodes');
  const locale = useLocale();
  const router = useRouter();
  const {
    project,
    setProject,
    planetCashAccount,
    projectList,
    bulkMethod,
    setBulkMethod,
  } = useBulkCode();
  const { user, logoutUser, setRefetchUserData } = useUserProps();
  const { tenantConfig } = useTenant();
  const { getAccessTokenSilently } = useAuth0();
  const { setErrors } = useContext(ErrorHandlingContext);
  const [localRecipients, setLocalRecipients] = useState<LocalRecipient[]>([]);
  const [comment, setComment] = useState('');
  const [occasion, setOccasion] = useState('');
  const [codeQuantity, setCodeQuantity] = useState('');
  const [unitsPerCode, setUnitsPerCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isEditingRecipient, setIsEditingRecipient] = useState(false);
  const [isAddingRecipient, setIsAddingRecipient] = useState(false);
  const [notificationLocale, setNotificationLocale] = useState('');

  const notificationLocales = [
    {
      langCode: 'en',
      languageName: 'English',
    },
    {
      langCode: 'de',
      languageName: 'Deutsch',
    },
  ];
  const resetBulkContext = (): void => {
    setProject(null);
    setBulkMethod(null);
  };
  const getTotalUnits = (): number => {
    if (bulkMethod === BulkCodeMethods.GENERIC) {
      return project ? Number(codeQuantity) * Number(unitsPerCode) : 0;
    } else {
      let totalUnits = 0;
      for (const recipient of localRecipients) {
        totalUnits = totalUnits + Number(recipient.units);
      }
      return totalUnits;
    }
  };

  const getProcessedRecipients = (): Recipient[] => {
    const recipients: Recipient[] = [];
    localRecipients.forEach((recipient) => {
      const temp = {
        recipientName: recipient.recipient_name,
        recipientEmail: recipient.recipient_email,
        message: recipient.recipient_message,
        notifyRecipient: recipient.recipient_notify === 'yes',
        units: parseInt(recipient.units),
      };
      recipients.push(temp);
    });
    return recipients;
  };

  useEffect(() => {
    if (locale) {
      setNotificationLocale(locale === 'de' ? 'de' : 'en');
    }
  }, [locale]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (isAddingRecipient || isEditingRecipient) {
      const shouldSubmit = confirm(t('unsavedDataWarning'));
      if (!shouldSubmit) return;
    }

    const token = await getAccessTokenSilently();
    setIsProcessing(true);
    if (project) {
      const donationData = {
        purpose: project.purpose,
        project: project.guid,
        prePaid: true,
        comment,
        treeCount: getTotalUnits(),
        gift: {},
      };
      switch (bulkMethod) {
        case BulkCodeMethods.GENERIC:
          donationData.gift = {
            type: 'code-bulk',
            occasion,
            numberOfCodes: Number(codeQuantity),
            unitsPerCode: Number(unitsPerCode),
          };
          break;
        case BulkCodeMethods.IMPORT:
          donationData.gift = {
            notificationLocale: notificationLocale,
            type: 'discrete-bulk',
            occasion,
            recipients: getProcessedRecipients(),
          };
          break;
      }

      const cleanedData = cleanObject(donationData);

      try {
        const res = await postAuthenticatedRequest<Donation>(
          tenantConfig?.id,
          `/app/donations`,
          cleanedData,
          token,
          logoutUser,
          {
            'IDEMPOTENCY-KEY': uuidv4(),
          }
        );
        // if request is successful, it will have a uid
        if (res?.uid) {
          resetBulkContext();
          setIsSubmitted(true);
          setRefetchUserData(true);
          setTimeout(() => {
            router.push(`/profile/history?ref=${res.uid}`);
          }, 5000);
        }
      } catch (err) {
        setIsProcessing(false);
        const serializedErrors = handleError(err as APIError);
        const _serializedErrors: SerializedError[] = [];

        for (const error of serializedErrors) {
          switch (error.message) {
            case 'planet_cash_invalid_project':
              _serializedErrors.push({
                message: t('donationError.planet_cash_invalid_project'),
              });
              break;

            case 'planet_cash_insufficient_credit':
              _serializedErrors.push({
                message: t('donationError.planet_cash_insufficient_credit', {
                  availableBalance: getFormatedCurrency(
                    locale,
                    planetCashAccount?.currency as string,
                    error.parameters && error.parameters['available_credit']
                  ),
                }),
              });
              break;

            case 'planet_cash_payment_failure':
              _serializedErrors.push({
                message: t('donationError.planet_cash_payment_failure', {
                  reason: error.parameters && error.parameters['reason'],
                }),
              });
              break;

            default:
              _serializedErrors.push(error);
              break;
          }
        }

        setErrors(_serializedErrors);
      }
    } else {
      setIsProcessing(false);
      setErrors([{ message: t('projectRequired') }]);
    }
  };

  const getTotalAmount = (): number | undefined => {
    if (bulkMethod === BulkCodeMethods.GENERIC) {
      return project
        ? Math.round(
            (project.unitCost * Number(codeQuantity) * Number(unitsPerCode) +
              Number.EPSILON) *
              100
          ) / 100
        : undefined;
    } else {
      let totalUnits = 0;
      for (const recipient of localRecipients) {
        totalUnits = totalUnits + Number(recipient.units);
      }
      return project
        ? Math.round((totalUnits * project.unitCost + Number.EPSILON) * 100) /
            100
        : undefined;
    }
  };

  const shouldDisableSubmission = useMemo(() => {
    const hasSufficientFunds =
      user?.planetCash != null &&
      user.planetCash.balance + user.planetCash.creditLimit > 0;
    const hasEnteredRequiredData =
      localRecipients.length > 0 ||
      (Number(codeQuantity) > 0 && Number(unitsPerCode) > 0);

    return hasSufficientFunds && !isProcessing && hasEnteredRequiredData;
  }, [user, localRecipients, codeQuantity, unitsPerCode, isProcessing]);

  const renderInvalidEmailWarning = useCallback(() => {
    return (
      <>
        {t.rich('invalidEmailWarningText', {
          termsLink: (chunks) => (
            <a
              target="_blank"
              href={`https://pp.eco/legal/${locale}/terms`}
              rel="noreferrer"
              className="planet-links"
              onClick={(e) => e.stopPropagation()}
            >
              {chunks}
            </a>
          ),
        })}
        <br />
      </>
    );
  }, [locale, t]);

  const renderTermsAndPrivacyText = useCallback(() => {
    return (
      <>
        {t.rich('termsAndPrivacyText', {
          termsLink: (chunks) => (
            <a
              target="_blank"
              href={`https://pp.eco/legal/${locale}/terms`}
              rel="noreferrer"
              className="planet-links"
              onClick={(e) => e.stopPropagation()}
            >
              {chunks}
            </a>
          ),
          privacyPolicyLink: (chunks) => (
            <a
              target="_blank"
              href={`https://pp.eco/legal/${locale}/privacy`}
              rel="noreferrer"
              className="planet-links"
              onClick={(e) => e.stopPropagation()}
            >
              {chunks}
            </a>
          ),
        })}
      </>
    );
  }, [locale, t]);

  if (!isSubmitted) {
    return (
      <CenteredContainer>
        <StyledFormContainer className="IssueCodesForm" component={'section'}>
          <div className="inputContainer">
            <ProjectSelector
              projectList={projectList || []}
              project={project}
              active={false}
              planetCashAccount={planetCashAccount}
            />
            <TextField
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              label={t('labelComment')}
            />
            <TextField
              onChange={(e) => setOccasion(e.target.value)}
              value={occasion}
              label={t('occasion')}
            />
            {bulkMethod === 'import' && (
              <TextField
                label={t('notificationLanguage')}
                variant="outlined"
                select
                value={notificationLocale}
                onChange={(event) =>
                  setNotificationLocale(event.target.value as string)
                }
              >
                {notificationLocales.map((locale) => (
                  <MenuItem key={locale.langCode} value={locale.langCode}>
                    {locale.languageName}
                  </MenuItem>
                ))}
              </TextField>
            )}
            {bulkMethod === 'generic' && (
              <GenericCodesPartial
                codeQuantity={codeQuantity}
                unitsPerCode={unitsPerCode}
                setCodeQuantity={setCodeQuantity}
                setUnitsPerCode={setUnitsPerCode}
              />
            )}
            {bulkMethod === 'import' && (
              <RecipientsUploadForm
                setLocalRecipients={setLocalRecipients}
                localRecipients={localRecipients}
                setIsAddingRecipient={setIsAddingRecipient}
                setIsEditingRecipient={setIsEditingRecipient}
              />
            )}
            <BulkGiftTotal
              amount={getTotalAmount()}
              currency={planetCashAccount?.currency}
              units={getTotalUnits()}
              unit={project?.unit}
            />
          </div>
          <BulkCodesError />
          <form onSubmit={handleSubmit}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="formButton"
              disabled={shouldDisableSubmission}
            >
              {isProcessing ? t('issuingCodes') : t('issueCodes')}
            </Button>
          </form>
          <div className={styles.issueCodeTermsAndWarnings}>
            {t('chargeConsentText')}
            <br />
            {bulkMethod === 'import' && renderInvalidEmailWarning()}
            {renderTermsAndPrivacyText()}
          </div>
        </StyledFormContainer>
      </CenteredContainer>
    );
  } else {
    return (
      <div className={styles.successMessage}>
        {t('donationSuccess')}
        <span className={styles.spinner}></span>
      </div>
    );
  }
};

export default IssueCodesForm;
