import React from 'react';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import { useForm } from 'react-hook-form';
import Fade from '@material-ui/core/Fade';
import styles from '../styles/RedeemModal.module.scss';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import i18next from '../../../../../i18n';
import { putAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import formStyles from '../styles/EditProfileModal.module.scss';
import spinnerStyle from '../../ManageProjects/styles/StepForm.module.scss';
import { ThemeContext } from '../../../../theme/themeContext';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';

const { useTranslation } = i18next;

export default function AddTargetModal({
  addTargetModalOpen,
  handleAddTargetModalClose,
}: any) {
  // External imports
  const { t, ready } = useTranslation(['me']);
  const { user, token, contextLoaded, setUser } = React.useContext(
    UserPropsContext
  );
  const { register, handleSubmit, errors } = useForm({ mode: 'onBlur' });
  const { theme } = React.useContext(ThemeContext);

  // Internal states
  const [target, setTarget] = React.useState(0);
  const [isLoadingForm, setIsLoading] = React.useState(false);

  // Function to change target
  const changeTarget = async () => {
    setIsLoading(true);
    if (contextLoaded && token) {
      const bodyToSend = {
        target: !target ? user.score.target : target,
      };
      putAuthenticatedRequest(`/app/profile`, bodyToSend, token)
        .then((res) => {
          handleAddTargetModalClose();
          const newUserInfo = {
            ...user,
            score: res.score,
          };
          setUser(newUserInfo);
          setIsLoading(false);
        })
        .catch((error) => {
          handleAddTargetModalClose();
          console.log(error);
          setIsLoading(false);
        });
    }
  };

  return ready && user ? (
    <Modal
      className={'modalContainer' + ' ' + theme}
      open={addTargetModalOpen}
      onClose={handleAddTargetModalClose}
      closeAfterTransition
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={addTargetModalOpen}>
        <div className={styles.modal}>
          <b> {t('me:setTarget')} </b>
          <div className={styles.inputField}>
            <MaterialTextField
              placeholder={user.score.target ? user.score.target : '10000'}
              InputProps={{ inputProps: { min: 1 } }}
              label=""
              type="number"
              defaultValue={user.score.target ? user.score.target : null}
              onChange={(e) => setTarget(e.target.value)}
              variant="outlined"
              inputRef={register({
                min: 1,
              })}
              name="addTarget"
            />
          </div>
          {errors.addTarget && (
            <span className={formStyles.formErrors}>
              {t('me:targetErrorMessage')}
            </span>
          )}
          {errors.addTarget ? (
            <div className="primaryButton" style={{ marginTop: '24px' }}>
              {t('me:targetSave')}
            </div>
          ) : (
            <button
              id={'AddTargetCont'}
              className="primaryButton"
              style={{ marginTop: '24px' }}
              onClick={() => handleSubmit(changeTarget)}
            >
              {isLoadingForm ? (
                <div className={spinnerStyle.spinner}></div>
              ) : (
                t('me:targetSave')
              )}
            </button>
          )}
        </div>
      </Fade>
    </Modal>
  ) : (
    <></>
  );
}
