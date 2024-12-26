import type { ReactElement } from 'react';
import type { APIError, SerializedError } from '@planet-sdk/common';
import type { RedeemedCodeData } from '../../../../common/types/redeem';

import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import React from 'react';
import { useTranslations } from 'next-intl';
import { postAuthenticatedRequest } from '../../../../../utils/apiRequests/api';
import { ThemeContext } from '../../../../../theme/themeContext';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { handleError } from '@planet-sdk/common';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import {
  RedeemFailed,
  SuccessfullyRedeemed,
  EnterRedeemCode,
} from '../../../../common/RedeemCode';
import { useTenant } from '../../../../common/Layout/TenantContext';
import { useMyForest } from '../../../../common/Layout/MyForestContext';
interface RedeemModal {
  redeemModalOpen: boolean;
  handleRedeemModalClose: () => void;
}

export default function RedeemModal({
  redeemModalOpen,
  handleRedeemModalClose,
}: RedeemModal): ReactElement | null {
  const t = useTranslations('Redeem');
  const { tenantConfig } = useTenant();
  const {
    user,
    contextLoaded,
    token,
    setUser,
    logoutUser,
    setRefetchUserData,
  } = useUserProps();
  const { setErrors, errors: apiErrors } =
    React.useContext(ErrorHandlingContext);
  const { refetchContributions } = useMyForest();
  const [inputCode, setInputCode] = React.useState<string | undefined>('');
  const [redeemedCodeData, setRedeemedCodeData] = React.useState<
    RedeemedCodeData | undefined
  >(undefined);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  async function redeemingCode(data: string | undefined): Promise<void> {
    setIsLoading(true);
    const submitData = {
      code: data,
    };
    if (contextLoaded && user) {
      try {
        const res = await postAuthenticatedRequest<RedeemedCodeData>(
          tenantConfig?.id,
          `/app/redeem`,
          submitData,
          token,
          logoutUser
        );
        setRedeemedCodeData(res);
        setRefetchUserData(true);
        setIsLoading(false);
        if (res.units > 0) {
          const cloneUser = { ...user };
          cloneUser.score.received = cloneUser.score.received + res.units;
          setUser(cloneUser);
          refetchContributions();
        }
      } catch (err) {
        const serializedErrors = handleError(err as APIError);
        const _serializedErrors: SerializedError[] = [];

        for (const error of serializedErrors) {
          switch (error.message) {
            case 'already_redeemed':
              _serializedErrors.push({
                message: t('alreadyRedeemed'),
              });
              break;

            case 'invalid_code':
              _serializedErrors.push({
                message: t('invalidCode'),
              });
              break;

            case 'self_gift':
              _serializedErrors.push({
                message: t('selfGiftMessage'),
              });
              break;

            default:
              _serializedErrors.push(error);
              break;
          }
        }
        setErrors(_serializedErrors);
        setIsLoading(false);
        setRedeemedCodeData(undefined);
      }
    }
  }

  const redeemAnotherCode = () => {
    setErrors(null);
    setInputCode('');
    setRedeemedCodeData(undefined);
  };

  const redeemCode = () => {
    if (inputCode) {
      redeemingCode(inputCode);
    }
  };

  const closeModal = () => {
    handleRedeemModalClose();
    setInputCode('');
    setRedeemedCodeData(undefined);
  };
  const { theme } = React.useContext(ThemeContext);

  return (
    <Modal
      className={'modalContainer' + ' ' + theme}
      open={redeemModalOpen}
      onClose={handleRedeemModalClose}
      closeAfterTransition
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Fade in={redeemModalOpen}>
        <div>
          {redeemedCodeData === undefined && !apiErrors && (
            <EnterRedeemCode
              isLoading={isLoading}
              setInputCode={setInputCode}
              inputCode={inputCode}
              redeemCode={redeemCode}
              closeRedeem={closeModal}
            />
          )}

          {redeemedCodeData && !apiErrors && (
            <SuccessfullyRedeemed
              redeemedCodeData={redeemedCodeData}
              redeemAnotherCode={redeemAnotherCode}
              closeRedeem={closeModal}
            />
          )}

          {apiErrors && (
            <RedeemFailed
              errorMessages={apiErrors}
              inputCode={inputCode}
              redeemAnotherCode={redeemAnotherCode}
              closeRedeem={closeModal}
            />
          )}
        </div>
      </Fade>
    </Modal>
  );
}
