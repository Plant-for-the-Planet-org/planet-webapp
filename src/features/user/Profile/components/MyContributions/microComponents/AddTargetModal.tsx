import React from 'react';
import Modal from '@mui/material/Modal';
import { useForm, Controller } from 'react-hook-form';
import Fade from '@mui/material/Fade';
import styles from '../../../../../common/RedeemCode/style/RedeemModal.module.scss';
import MaterialTextField from '../../../../../common/InputTypes/MaterialTextField';
import { useTranslations } from 'next-intl';
import { putAuthenticatedRequest } from '../../../../../../utils/apiRequests/api';
import { ThemeContext } from '../../../../../../theme/themeContext';
import { useUserProps } from '../../../../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../../../../common/Layout/ErrorHandlingContext';
import { handleError, APIError, User } from '@planet-sdk/common';
import { useTenant } from '../../../../../common/Layout/TenantContext';
import CancelIcon from '../../../../../../../public/assets/images/icons/CancelIcon';

type FormData = {
  target: number | undefined;
};
interface AddTargetModalProps {
  addTargetModalOpen: boolean;
  handleAddTargetModalClose: () => void;
}

export default function AddTargetModal({
  addTargetModalOpen,
  handleAddTargetModalClose,
}: AddTargetModalProps) {
  // External imports
  const t = useTranslations('Me');
  const { user, token, contextLoaded, setUser, logoutUser } = useUserProps();
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: { target: user?.score.target },
  });
  const { tenantConfig } = useTenant();
  const { theme } = React.useContext(ThemeContext);
  const { setErrors } = React.useContext(ErrorHandlingContext);

  // Internal states
  const [isLoadingForm, setIsLoading] = React.useState(false);

  // Function to change target
  const changeTarget = async ({ target }: FormData) => {
    setIsLoading(true);
    if (contextLoaded && token && addTargetModalOpen) {
      const bodyToSend = {
        target,
      };

      try {
        const res = await putAuthenticatedRequest<User>(
          tenantConfig?.id,
          `/app/profile`,
          bodyToSend,
          token,
          logoutUser
        );
        handleAddTargetModalClose();
        const newUserInfo = {
          ...user,
          score: res.score,
        };
        setUser(newUserInfo);
        setIsLoading(false);
      } catch (err) {
        handleAddTargetModalClose();
        setIsLoading(false);
        setErrors(handleError(err as APIError));
      }
    }
    if (!addTargetModalOpen) setIsLoading(false);
  };

  return user ? (
    <Modal
      className={'modalContainer' + ' ' + theme}
      open={addTargetModalOpen}
      onClose={handleAddTargetModalClose}
      closeAfterTransition
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Fade in={addTargetModalOpen}>
        <form onSubmit={handleSubmit(changeTarget)} className={styles.modal}>
          <div className={styles.CancelIconContainer}>
            <button
              className={styles.CancelButton}
              onClick={() => handleAddTargetModalClose()}
            >
              <CancelIcon />
            </button>
            <div>
              <b>{t('setTarget')}</b>{' '}
            </div>
            <div className={styles.inputField}>
              <Controller
                name="target"
                control={control}
                rules={{ min: 1, required: true }}
                render={({ field: { onChange: handleChange, value } }) => (
                  <MaterialTextField
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, '');
                      handleChange(e);
                    }}
                    value={value}
                    variant="outlined"
                  />
                )}
              />
            </div>
            {errors.target && (
              <span className={'formErrors'}>{t('targetErrorMessage')}</span>
            )}
            {errors.target ? (
              <div className="primaryButton" style={{ marginTop: '24px' }}>
                {t('targetSave')}
              </div>
            ) : (
              <button
                id={'AddTargetCont'}
                className="primaryButton"
                style={{ marginTop: '24px' }}
                type="submit"
              >
                {isLoadingForm ? (
                  <div className={'spinner'}></div>
                ) : (
                  t('targetSave')
                )}
              </button>
            )}
          </div>
        </form>
      </Fade>
    </Modal>
  ) : (
    <></>
  );
}
