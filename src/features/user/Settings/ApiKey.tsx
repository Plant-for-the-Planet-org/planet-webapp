import React from 'react';
import styles from './ApiKey.module.scss';
import i18next from '../../../../i18n';
import MaterialTextField from '../../common/InputTypes/MaterialTextField';
import AnimatedButton from '../../common/InputTypes/AnimatedButton';
import { getAuthenticatedRequest, putAuthenticatedRequest } from '../../../utils/apiRequests/api';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import CopyToClipboard from '../../common/CopyToClipboard';

const { useTranslation } = i18next;

export default function ApiKey({ }: any) {
    const { token, contextLoaded } = React.useContext(UserPropsContext);
    const { t } = useTranslation(['me']);
    const { handleError } = React.useContext(ErrorHandlingContext);
    const [isUploadingData, setIsUploadingData] = React.useState(false);
    const [apiKey, setApiKey] = React.useState('');

    const getApiKey = async () => {
        setIsUploadingData(true);
        const res = await getAuthenticatedRequest('/app/profile/apiKey', token, {}, handleError)
        if (res) {
            setApiKey(res.apiKey);
        };
        setIsUploadingData(false);
    };

    const regenerateApiKey = async () => {
        setIsUploadingData(true);
        const res = await putAuthenticatedRequest('/app/profile/apiKey', undefined, token, handleError)
        if (res) {
            setApiKey(res.apiKey);
        };
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
                    <br /><br />
                    {t('me:apiKeyMessage2')}
                    <br /><br />
                    {t('me:apiKeyMessage3')}
                </p>
                <div className={styles.apiKeyContainer}>
                    <MaterialTextField
                        // label={t('me:apiKey')}
                        type="text"
                        variant="outlined"
                        name="apiKey"
                        disabled
                        value={apiKey}
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
