import React, { FormEvent, ReactElement, useContext, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Button, TextField } from '@mui/material';
import styles from '../../../../../src/features/user/BulkCodes';
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
import StyledForm from '../../../common/Layout/StyledForm';
import { handleError, APIError, SerializedError } from '@planet-sdk/common';

interface IssueCodesFormProps {}

const IssueCodesForm = ({}: IssueCodesFormProps): ReactElement | null => {
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
        const res = await postAuthenticatedRequest(
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

  if (ready) {
    if (!isSubmitted) {
      return (
        <CenteredContainer>
          <StyledForm className="IssueCodesForm" onSubmit={handleSubmit}>
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
                  onRecipientsUploaded={setLocalRecipients}
                  localRecipients={localRecipients}
                />
              )}
              <BulkGiftTotal
                amount={getTotalAmount()}
                currency={planetCashAccount?.currency}
                units={getTotalUnits()}
                unit={project?.unit}
                isImport={bulkMethod === 'import'}
              />
            </div>

            <BulkCodesError />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="formButton"
              disabled={
                !(
                  user.planetCash &&
                  !(user.planetCash.balance + user.planetCash.creditLimit <= 0)
                ) ||
                isProcessing ||
                (localRecipients.length === 0 &&
                  (Number(codeQuantity) <= 0 || Number(unitsPerCode) <= 0))
              }
            >
              {isProcessing
                ? t('bulkCodes:issuingCodes')
                : t('bulkCodes:issueCodes')}
            </Button>
          </StyledForm>
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
