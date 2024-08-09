import React from 'react';
import styles from './ApiKey.module.scss';
import {
  getAuthenticatedRequest,
  putAuthenticatedRequest,
} from '../../../../utils/apiRequests/api';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import CopyToClipboard from '../../../common/CopyToClipboard';
import EyeIcon from '../../../../../public/assets/images/icons/EyeIcon';
import EyeDisabled from '../../../../../public/assets/images/icons/EyeDisabled';
import { useTranslations } from 'next-intl';
import StyledForm from '../../../common/Layout/StyledForm';
import { Button, InputAdornment, TextField } from '@mui/material';
import { APIError, handleError } from '@planet-sdk/common';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
import { useTenant } from '../../../common/Layout/TenantContext';

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
  const { token, contextLoaded, logoutUser } = useUserProps();
  const t = useTranslations('Me');
  const { tenantConfig } = useTenant();
  const { setErrors } = React.useContext(ErrorHandlingContext);
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const [apiKey, setApiKey] = React.useState('');
  const [isApiKeyVisible, setIsApiKeyVisible] = React.useState(false);

  const handleVisibilityChange = () => {
    setIsApiKeyVisible(!isApiKeyVisible);
  };

  const getApiKey = async () => {
    setIsUploadingData(true);
    try {
      const res = await getAuthenticatedRequest<ApiKeyResponse>(
        tenantConfig?.id,
        '/app/profile/apiKey',
        token,
        logoutUser
      );
      if (res) {
        setApiKey(res.apiKey || '');
      }
    } catch (err) {
      setErrors(handleError(err as APIError));
    }
    setIsUploadingData(false);
  };

  const regenerateApiKey = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsUploadingData(true);
    try {
      const res = await putAuthenticatedRequest<ApiKeyResponse>(
        tenantConfig?.id,
        '/app/profile/apiKey',
        undefined,
        token,
        logoutUser
      );
      if (res) {
        setApiKey(res.apiKey || '');
      }
    } catch (err) {
      setErrors(handleError(err as APIError));
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
        <InlineFormDisplayGroup type="other">
          <TextField
            type={isApiKeyVisible ? 'text' : 'password'}
            variant="outlined"
            name="apiKey"
            disabled
            value={apiKey}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <EyeButton
                    isVisible={isApiKeyVisible}
                    onClick={handleVisibilityChange}
                  />
                </InputAdornment>
              ),
            }}
          />
          <CopyToClipboard text={apiKey} isButton />
        </InlineFormDisplayGroup>
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
              t('regenerateKey')
            )}
          </Button>
        </div>
      </div>
    </StyledForm>
  );
}
