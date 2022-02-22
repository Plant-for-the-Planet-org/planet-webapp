import React from 'react';
import styles from './ApiKey.module.scss';
import i18next from '../../../../i18n';
import MaterialTextField from '../../common/InputTypes/MaterialTextField';
import AnimatedButton from '../../common/InputTypes/AnimatedButton';
import { deleteAuthenticatedRequest, getAuthenticatedRequest, getRequest, putAuthenticatedRequest } from '../../../utils/apiRequests/api';
import { ThemeContext } from '../../../theme/themeContext';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';

const { useTranslation } = i18next;

export default function ApiKey({ }: any) {
    const { user, token, logoutUser, contextLoaded } = React.useContext(UserPropsContext);
    const { t, ready } = useTranslation(['me']);
    const handleChange = (e) => {
        e.preventDefault();
    };
    const { handleError } = React.useContext(ErrorHandlingContext);
    const [isUploadingData, setIsUploadingData] = React.useState(false);
    const [apiKey, setApiKey] = React.useState('');

    const [canDeleteAccount, setcanDeleteAccount] = React.useState(false);

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
        const res = await fetch(`${process.env.API_ENDPOINT}/app/profile/apiKey`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-TOKEN-API': `${apiKey}`
            }
        });
        console.log('res', res)
        // if (res) {
        //     setApiKey(res.apiKey);
        // };
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
                <MaterialTextField
                    // label={t('me:apiKey')}
                    type="text"
                    variant="outlined"
                    style={{ marginTop: '20px' }}
                    name="apiKey"
                    disabled
                    value={apiKey}
                />

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
