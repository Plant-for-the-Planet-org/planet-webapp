import React from 'react';
import styles from './ApiKey.module.scss';
import MaterialTextField from '../../common/InputTypes/MaterialTextField';
import AnimatedButton from '../../common/InputTypes/AnimatedButton';
import {
  getAuthenticatedRequest,
  putAuthenticatedRequest,
} from '../../../utils/apiRequests/api';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import CopyToClipboard from '../../common/CopyToClipboard';
import EyeIcon from '../../../../public/assets/images/icons/EyeIcon';
import EyeDisabled from '../../../../public/assets/images/icons/EyeDisabled';
import { useTranslation } from 'next-i18next';
import { ParamsContext } from '../../common/Layout/QueryParamsContext';

const EyeButton = ({ isVisible, onClick }: any) => {
  return (
    <div className={styles.eyeButton} onClick={onClick}>
      {isVisible ? <EyeIcon /> : <EyeDisabled />}
    </div>
  );
};

export default function ApiKey({}: any) {
  const { token, contextLoaded } = React.useContext(UserPropsContext);
  const { t } = useTranslation(['me']);
  const { handleError } = React.useContext(ErrorHandlingContext);
  const { email } = React.useContext(ParamsContext);
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const [apiKey, setApiKey] = React.useState('');
  const [isApiKeyVisible, setIsApiKeyVisible] = React.useState(false);

  const handleVisibilityChange = () => {
    setIsApiKeyVisible(!isApiKeyVisible);
  };

  const getApiKey = async () => {
    setIsUploadingData(true);
    const res = await getAuthenticatedRequest(
      email,
      '/app/profile/apiKey',
      token,
      {},
      handleError
    );
    if (res) {
      setApiKey(res.apiKey);
    }
    setIsUploadingData(false);
  };

  const regenerateApiKey = async () => {
    setIsUploadingData(true);
    const res = await putAuthenticatedRequest(
      '/app/profile/apiKey',
      undefined,
      token,
      handleError
    );
    if (res) {
      setApiKey(res.apiKey);
    }
    setIsUploadingData(false);
  };

  React.useEffect(() => {
    if (token && contextLoaded) {
      getApiKey();
    }
  }, [token, contextLoaded]);

  return (
    <div className="profilePage" style={{ backgroundColor: '#fff' }}>
      <p className={'profilePageTitle'}> {t('apiKey')}</p>
      <div className={styles.apiPage}>
        <p className={styles.deleteModalContent}>
          {t('me:apiKeyMessage1')}
          {/* <br /><br />
                   {t('me:apiKeyMessage2')} */}
          <br />
          <br />
          {t('me:apiKeyMessage3')}
        </p>
        <div className={styles.apiKeyContainer}>
          <MaterialTextField
            // label={t('me:apiKey')}
            type={isApiKeyVisible ? 'text' : 'password'}
            variant="outlined"
            name="apiKey"
            disabled
            value={apiKey}
          />
          <EyeButton
            isVisible={isApiKeyVisible}
            onClick={handleVisibilityChange}
          />
          <CopyToClipboard text={apiKey} isButton />
        </div>
        <div className={styles.regenerateButtonContainer}>
          <AnimatedButton
            onClick={regenerateApiKey}
            className={styles.regenerateButton}
          >
            {isUploadingData ? (
              <div className={'spinner'}></div>
            ) : (
              t('me:regenerateKey')
            )}
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
}
