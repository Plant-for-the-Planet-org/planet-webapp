import React from 'react';
import Modal from '@mui/material/Modal';
import { useForm, Controller } from 'react-hook-form';
import Fade from '@mui/material/Fade';
import styles from '../../../../common/RedeemCode/style/RedeemModal.module.scss';
import MaterialTextField from '../../../../common/InputTypes/MaterialTextField';
import { useTranslation } from 'next-i18next';
import { putAuthenticatedRequest } from '../../../../../utils/apiRequests/api';
import { ThemeContext } from '../../../../../theme/themeContext';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import { handleError, APIError } from '@planet-sdk/common';
import CancelIcon from '../../../../../../public/assets/images/icons/CancelIcon';
import projectContainerStyle from '../../styles/ProjectsContainer.module.scss';

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
  const { t, ready } = useTranslation(['me']);
  const { user, token, contextLoaded, setUser, logoutUser } = useUserProps();
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: { target: user?.score.target },
  });
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
        const res = await putAuthenticatedRequest(
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

  return ready && user ? (
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
          <div className={projectContainerStyle.CancelIconContainer}>
            <button
              className={projectContainerStyle.CancelButton}
              onClick={() => handleAddTargetModalClose()}
            >
              <CancelIcon />
            </button>
            <div>
              <b>{t('me:setTarget')}</b>{' '}
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
              <span className={'formErrors'}>{t('me:targetErrorMessage')}</span>
            )}
            {errors.target ? (
              <div className="primaryButton" style={{ marginTop: '24px' }}>
                {t('me:targetSave')}
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
                  t('me:targetSave')
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
