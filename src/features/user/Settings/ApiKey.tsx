import React from 'react';
import styles from './ApiKey.module.scss';
import i18next from '../../../../i18n';
import MaterialTextField from '../../common/InputTypes/MaterialTextField';
import AnimatedButton from '../../common/InputTypes/AnimatedButton';
import { deleteAuthenticatedRequest } from '../../../utils/apiRequests/api';
import { ThemeContext } from '../../../theme/themeContext';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';

const { useTranslation } = i18next;

export default function ApiKey({ }: any) {
    const { user, token, logoutUser } = React.useContext(UserPropsContext);
    const { t, ready } = useTranslation(['me', 'common', 'editProfile']);
    const handleChange = (e) => {
        e.preventDefault();
    };
    const { handleError } = React.useContext(ErrorHandlingContext);
    const [isUploadingData, setIsUploadingData] = React.useState(false);

    const [canDeleteAccount, setcanDeleteAccount] = React.useState(false);

    const handleDeleteAccount = () => {
        setIsUploadingData(true);
        deleteAuthenticatedRequest('/app/profile', token, handleError).then((res) => {
            if (res !== 404) {
                logoutUser(`${process.env.NEXTAUTH_URL}/`);
            } else {
                console.log(res.errorText);
            }
        });
    };

    const { theme } = React.useContext(ThemeContext);

    return (
        <div className="profilePage" style={{ backgroundColor: '#fff' }}>
            <p className={'profilePageTitle'}> {t('common:apiKey')}</p>
            <div className={styles.apiPage}>
                <p className={styles.deleteModalContent}>
                    {t('me:apiKeyMessage1')}
                    <br /><br />
                    {t('me:apiKeyMessage2')}
                    <br /><br />
                    {t('me:apiKeyMessage3')}
                </p>
                <MaterialTextField
                    // placeholder={t('common:deleteAccount')}
                    label={t('me:apiKey')}
                    type="text"
                    variant="outlined"
                    style={{ marginTop: '20px' }}
                    name="addTarget"
                    onCut={handleChange}
                    onCopy={handleChange}
                    onPaste={handleChange}
                    onChange={(e) => {
                        if (e.target.value === 'Delete') {
                            setcanDeleteAccount(true);
                        } else {
                            setcanDeleteAccount(false);
                        }
                    }}
                />

                <div className={styles.deleteButtonContainer}>
                    <AnimatedButton
                        onClick={() => handleDeleteAccount()}
                        className={styles.deleteButton}
                    >
                        {isUploadingData ? (
                            <div className={'spinner'}></div>
                        ) : (
                            t('common:regenerateKey')
                        )}
                    </AnimatedButton>

                </div>
            </div>
        </div>
    );
}
