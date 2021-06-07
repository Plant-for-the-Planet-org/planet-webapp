import React from 'react';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import { useForm } from 'react-hook-form';
import Fade from '@material-ui/core/Fade';
import styles from '../styles/RedeemModal.module.scss';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import i18next from '../../../../../i18n';
import { putAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { useAuth0 } from '@auth0/auth0-react';
import formStyles from '../styles/EditProfileModal.module.scss';
import spinnerStyle from '../../ManageProjects/styles/StepForm.module.scss';
import { ThemeContext } from '../../../../theme/themeContext';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';

const { useTranslation } = i18next;

export default function AddTargetModal({
  addTargetModalOpen,
  handleAddTargetModalClose,
  changeForceReload,
  forceReload,
}: any) {
  const [target, setTarget] = React.useState(0);
  const { t, ready } = useTranslation(['target']);
  const { register, handleSubmit, errors } = useForm({ mode: 'onBlur' });
  const [isLoadingForm, setIsLoading] = React.useState(false);
  const { user, token, contextLoaded } = React.useContext(UserPropsContext);

  const apiCallChangeTarget = async () => {
    setIsLoading(true);
    if (contextLoaded && token) {
      const bodyToSend = {
        target: !target ? user.score.target : target,
      };
      putAuthenticatedRequest(`/app/profile`, bodyToSend, token)
        .then((res) => {
          handleAddTargetModalClose();
          changeForceReload(!forceReload);
          setIsLoading(false);
        })
        .catch((error) => {
          handleAddTargetModalClose();
          console.log(error);
          setIsLoading(false);
        });
    }
  };
  const { theme } = React.useContext(ThemeContext);

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
          <h4>
            <b> {t('target:setTarget')} </b>
          </h4>
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
              {t('target:targetErrorMessage')}
            </span>
          )}
          {errors.addTarget ? (
            <div className="primaryButton" style={{ marginTop: '24px' }}>
              {t('target:targetSave')}
            </div>
          ) : (
            <button
              id={'AddTargetCont'}
              className="primaryButton"
              style={{ marginTop: '24px' }}
              onClick={() => handleSubmit(apiCallChangeTarget())}
            >
              {isLoadingForm ? (
                <div className={spinnerStyle.spinner}></div>
              ) : (
                t('target:targetSave')
              )}
            </button>
          )}
        </div>
      </Fade>
    </Modal>
  ) : null;
}
