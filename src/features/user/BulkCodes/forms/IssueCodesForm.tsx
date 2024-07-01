import React, {
  FormEvent,
  ReactElement,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { useTranslation, Trans } from 'next-i18next';
import { Button, TextField } from '@mui/material';
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

const IssueCodesForm = (): ReactElement | null => {
  const { t, ready, i18n } = useTranslation(['common', 'bulkCodes']);
  const router = useRouter();
  const {
    project,
    setProject,
    planetCashAccount,
    projectList,
    bulkMethod,
    setBulkMethod,
  } = useBulkCode();
  const { user, logoutUser } = useUserProps();
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
        // occasion: recipient.recipient_occasion,
      };
      recipients.push(temp);
    });
    return recipients;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (isAddingRecipient || isEditingRecipient) {
      const shouldSubmit = confirm(t('bulkCodes:unsavedDataWarning'));
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
            type: 'discrete-bulk',
            occasion,
            recipients: getProcessedRecipients(),
          };
          break;
      }

      const cleanedData = cleanObject(donationData);

      try {
        const res = await postAuthenticatedRequest<Donation>(
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
                message: t(
                  'bulkCodes:donationError.planet_cash_invalid_project'
                ),
              });
              break;

            case 'planet_cash_insufficient_credit':
              _serializedErrors.push({
                message: t(
                  'bulkCodes:donationError.planet_cash_insufficient_credit',
                  {
                    availableBalance: getFormatedCurrency(
                      i18n.language,
                      planetCashAccount?.currency as string,
                      error.parameters && error.parameters['available_credit']
                    ),
                  }
                ),
              });
              break;

            case 'planet_cash_payment_failure':
              _serializedErrors.push({
                message: t(
                  'bulkCodes:donationError.planet_cash_payment_failure',
                  {
                    reason: error.parameters && error.parameters['reason'],
                  }
                ),
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
      setErrors([{ message: t('bulkCodes:projectRequired') }]);
    }
  };

  const totalAmount = useMemo((): number | undefined => {
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
  }, [bulkMethod, project, codeQuantity, unitsPerCode, localRecipients]);

  const shouldDisableSubmission = useMemo(() => {
    const hasSufficientFunds =
      user?.planetCash != null &&
      user.planetCash.balance + user.planetCash.creditLimit > 0;
    const hasEnteredRequiredData =
      localRecipients.length > 0 ||
      (Number(codeQuantity) > 0 && Number(unitsPerCode) > 0);

    return (
      !hasSufficientFunds ||
      isProcessing ||
      !hasEnteredRequiredData ||
      !totalAmount ||
      totalAmount <= 0
    );
  }, [
    user,
    localRecipients,
    codeQuantity,
    unitsPerCode,
    isProcessing,
    totalAmount,
  ]);

  const renderInvalidEmailWarning = useCallback(() => {
    return (
      <>
        {t('bulkCodes:invalidEmailWarningText')}
        <br />
      </>
    );
  }, [i18n.language, t]);

  const renderTermsAndPrivacyText = useCallback(() => {
    return (
      <>
        <Trans key={'bulkCodes:termsAndPrivacyText'}>
          Read more about our{' '}
          <a
            target="_blank"
            href={`https://pp.eco/legal/${i18n.language}/terms`}
            rel="noreferrer"
            className="planet-links"
            onClick={(e) => e.stopPropagation()}
          >
            terms and conditions
          </a>{' '}
          and the{' '}
          <a
            target="_blank"
            href={`https://pp.eco/legal/${i18n.language}/privacy`}
            rel="noreferrer"
            className="planet-links"
            onClick={(e) => e.stopPropagation()}
          >
            privacy policy
          </a>
          .
        </Trans>
      </>
    );
  }, [i18n.language, t]);

  if (ready) {
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
                label={t('bulkCodes:labelComment')}
              />
              <TextField
                onChange={(e) => setOccasion(e.target.value)}
                value={occasion}
                label={t('bulkCodes:occasion')}
              />
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
                amount={totalAmount}
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
                {isProcessing
                  ? t('bulkCodes:issuingCodes')
                  : t('bulkCodes:issueCodes')}
              </Button>
            </form>
            <div className={styles.issueCodeTermsAndWarnings}>
              {t('bulkCodes:chargeConsentText')}
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
          {t('bulkCodes:donationSuccess')}
          <span className={styles.spinner}></span>
        </div>
      );
    }
  }

  return null;
};

export default IssueCodesForm;
