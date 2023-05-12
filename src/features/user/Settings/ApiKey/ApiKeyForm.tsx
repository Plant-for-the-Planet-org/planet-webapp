import React from 'react';
import styles from './ApiKey.module.scss';
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
import { Button, TextField } from '@mui/material';
import { ApiCustomError } from '../../../common/types/apiErrors';

interface EyeButtonParams {
  isVisible: boolean;
  onClick: () => void;
}
interface ApiKeyResponse {
  apiKey: string;
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
    const res: ApiKeyResponse | ApiCustomError | undefined =
      await getAuthenticatedRequest(
        '/app/profile/apiKey',
        token,
        impersonatedEmail,
        {},
        handleError
      );
    if (res) {
      setApiKey(res.apiKey || '');
    }
    setIsUploadingData(false);
  };

  const regenerateApiKey = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsUploadingData(true);
    const res: ApiKeyResponse | ApiCustomError | undefined =
      await putAuthenticatedRequest(
        '/app/profile/apiKey',
        undefined,
        token,
        impersonatedEmail,
        handleError
      );
    if (res) {
      setApiKey(res.apiKey || '');
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
        <div>
          <Button
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
              regenerateApiKey(e)
            }
            variant="contained"
            color="primary"
          >
            {isUploadingData ? (
              <div className={'spinner'}></div>
            ) : (
              t('me:regenerateKey')
            )}
          </Button>
        </div>
      </div>
    </StyledForm>
  );
}
