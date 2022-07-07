import React, { FormEvent, ReactElement, useContext, useState } from 'react';
import i18next from '../../../../../i18n';
import { Button, TextField } from '@mui/material';

import styles from '../BulkCodes.module.scss';
import { useRouter } from 'next/router';

import BulkCodesForm from './BulkCodesForm';
import ProjectSelector from '../components/ProjectSelector';
import BulkGiftTotal from '../components/BulkGiftTotal';
import RecipientsUploadForm from '../components/RecipientsUploadForm';
import GenericCodesPartial from '../components/GenericCodesPartial';
import BulkCodesError from '../components/BulkCodesError';

import { useBulkCode, Recipient } from '../../../common/Layout/BulkCodeContext';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';
import cleanObject from '../../../../utils/cleanObject';
import { postAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { useAuth0 } from '@auth0/auth0-react';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { v4 as uuidv4 } from 'uuid';
import { BulkCodeMethods } from '../../../../utils/constants/bulkCodeMethods';
import { Recipient as LocalRecipient } from '../BulkCodesTypes';
const { useTranslation } = i18next;

interface IssueCodesFormProps {}

const IssueCodesForm = ({}: IssueCodesFormProps): ReactElement | null => {
  const { t, ready } = useTranslation(['common', 'bulkCodes']);
  const router = useRouter();
  const {
    project,
    setProject,
    planetCashAccount,
    projectList,
    bulkMethod,
    setBulkMethod,
  } = useBulkCode();
  const { user } = useContext(UserPropsContext);
  const { getAccessTokenSilently } = useAuth0();
  const { handleError } = useContext(ErrorHandlingContext);
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
        treeCount: 0,
        gift: {},
      };
      switch (bulkMethod) {
        case BulkCodeMethods.GENERIC:
          donationData.treeCount = Number(codeQuantity) * Number(unitsPerCode);
          donationData.gift = {
            type: 'code-bulk',
            occasion,
            numberOfCodes: Number(codeQuantity),
            unitsPerCode: Number(unitsPerCode),
          };
          break;
        case BulkCodeMethods.IMPORT:
          donationData.treeCount = getTotalUnits();
          donationData.gift = {
            type: 'discrete-bulk',
            occasion,
            recipients: getProcessedRecipients(),
          };
          break;
        default:
          break;
      }

      const cleanedData = cleanObject(donationData);
      const res = await postAuthenticatedRequest(
        `/app/donations`,
        cleanedData,
        token,
        handleError,
        {
          'IDEMPOTENCY-KEY': uuidv4(),
        }
      );
      if (!res.code) {
        resetBulkContext();
        setIsSubmitted(true);
        setTimeout(() => {
          router.push(`/profile/history?ref=${res.uid}`);
        }, 5000);
      } else {
        setIsProcessing(false);
        handleError(Error(res.errors.errors[0]));
      }
    } else {
      setIsProcessing(false);
      handleError(Error('Project not selected'));
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

  if (ready) {
    if (!isSubmitted) {
      return (
        <BulkCodesForm className="IssueCodesForm" onSubmit={handleSubmit}>
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
        </BulkCodesForm>
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
