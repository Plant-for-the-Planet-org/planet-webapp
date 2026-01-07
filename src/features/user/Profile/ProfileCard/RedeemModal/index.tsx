import type { ReactElement } from 'react';
import type { APIError, SerializedError } from '@planet-sdk/common';
import type { RedeemedCodeData } from '../../../../common/types/redeem';

import { useState, useContext } from 'react';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { useTranslations } from 'next-intl';
import { ThemeContext } from '../../../../../theme/themeContext';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { handleError } from '@planet-sdk/common';
import {
  RedeemFailed,
  SuccessfullyRedeemed,
  EnterRedeemCode,
} from '../../../../common/RedeemCode';
import { useMyForestStore } from '../../../../../stores/myForestStore';
import { useApi } from '../../../../../hooks/useApi';
import { useErrorHandlingStore } from '../../../../../stores/errorHandlingStore';

interface RedeemModal {
  redeemModalOpen: boolean;
  handleRedeemModalClose: () => void;
}

type RedeemCodeApiPayload = {
  code: string;
};
export default function RedeemModal({
  redeemModalOpen,
  handleRedeemModalClose,
}: RedeemModal): ReactElement | null {
  const t = useTranslations('Redeem');
  const { postApiAuthenticated, getApi, getApiAuthenticated } = useApi();
  const { user, contextLoaded, setUser, setRefetchUserData } = useUserProps();
  const refetchMyForest = useMyForestStore((state) => state.fetchMyForest);
  // local state
  const [inputCode, setInputCode] = useState<string | undefined>('');
  const [redeemedCodeData, setRedeemedCodeData] = useState<
    RedeemedCodeData | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // store
  const apiErrors = useErrorHandlingStore((state) => state.errors);
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  async function redeemingCode(data: string): Promise<void> {
    setIsLoading(true);
    const payload = {
      code: data,
    };
    if (contextLoaded && user) {
      try {
        const res = await postApiAuthenticated<
          RedeemedCodeData,
          RedeemCodeApiPayload
        >(`/app/redeem`, {
          payload,
        });
        setRedeemedCodeData(res);
        setRefetchUserData(true);
        setIsLoading(false);
        if (res.units > 0) {
          const cloneUser = { ...user };
          cloneUser.score.received = cloneUser.score.received + res.units;
          setUser(cloneUser);
          refetchMyForest(getApi, getApiAuthenticated);
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
  const { theme } = useContext(ThemeContext);

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
