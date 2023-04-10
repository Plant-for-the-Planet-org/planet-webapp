import React from 'react';
import styles from './ApiKey.module.scss';
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
import {
  getAuthenticatedRequest,
  putAuthenticatedRequest,
} from '../../../../utils/apiRequests/api';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import CopyToClipboard from '../../../common/CopyToClipboard';
import EyeIcon from '../../../../../public/assets/images/icons/EyeIcon';
import EyeDisabled from '../../../../../public/assets/images/icons/EyeDisabled';
import { useTranslation } from 'next-i18next';
import StyledForm from '../../../common/Layout/StyledForm';
import { TextField } from '@mui/material';

interface EyeButtonParams {
  isVisible: boolean;
  onClick: () => void;
}

const EyeButton = ({ isVisible, onClick }: EyeButtonParams) => {
  return (
    <div className={styles.eyeButton} onClick={onClick}>
      {isVisible ? <EyeIcon /> : <EyeDisabled />}
    </div>
  );
};

export default function ApiKey() {
  const { token, contextLoaded, impersonatedEmail } =
    React.useContext(UserPropsContext);
  const { t } = useTranslation(['me']);
  const { handleError } = React.useContext(ErrorHandlingContext);
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const [apiKey, setApiKey] = React.useState('');
  const [isApiKeyVisible, setIsApiKeyVisible] = React.useState(false);

  const handleVisibilityChange = () => {
    setIsApiKeyVisible(!isApiKeyVisible);
  };

  const getApiKey = async () => {
    setIsUploadingData(true);
    const res = await getAuthenticatedRequest(
      '/app/profile/apiKey',
      token,
      impersonatedEmail,
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
      impersonatedEmail,
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
    <StyledForm>
      <div className="inputContainer">
        <div className={styles.apiPage}>
          <div className={styles.apiKeyContainer}>
            <TextField
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
    </StyledForm>
  );
}
