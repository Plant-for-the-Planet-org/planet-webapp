import type { APIError } from '@planet-sdk/common';

import { useEffect, useState, useContext } from 'react';
import styles from './ApiKey.module.scss';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import CopyToClipboard from '../../../common/CopyToClipboard';
import EyeIcon from '../../../../../public/assets/images/icons/EyeIcon';
import EyeDisabled from '../../../../../public/assets/images/icons/EyeDisabled';
import { useTranslations } from 'next-intl';
import StyledForm from '../../../common/Layout/StyledForm';
import { Button, InputAdornment, TextField } from '@mui/material';
import { handleError } from '@planet-sdk/common';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
import { useApi } from '../../../../hooks/useApi';

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
  const { token, contextLoaded } = useUserProps();
  const t = useTranslations('Me');
  const { setErrors } = useContext(ErrorHandlingContext);
  const { getApiAuthenticated, putApiAuthenticated } = useApi();
  const [isUploadingData, setIsUploadingData] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);

  const handleVisibilityChange = () => {
    setIsApiKeyVisible(!isApiKeyVisible);
  };

  const getApiKey = async () => {
    setIsUploadingData(true);
    try {
      const res = await getApiAuthenticated<ApiKeyResponse>(
        `/app/profile/apiKey`
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
    e: MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsUploadingData(true);
    try {
      const res = await putApiAuthenticated<ApiKeyResponse>(
        `/app/profile/apiKey`,
        { payload: {} }
      );
      if (res) {
        setApiKey(res.apiKey || '');
      }
    } catch (err) {
      setErrors(handleError(err as APIError));
    }
    setIsUploadingData(false);
  };

  useEffect(() => {
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
            onClick={(e: MouseEvent<HTMLButtonElement, MouseEvent>) =>
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
