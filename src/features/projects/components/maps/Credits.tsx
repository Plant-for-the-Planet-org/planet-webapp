import React, { ReactElement } from 'react';
import styles from '../../styles/ProjectsMap.module.scss';
import i18next from '../../../../../i18n';
import SelectLanguageAndCountry from '../../../common/Layout/Footer/SelectLanguageAndCountry';

interface Props {
    setCurrencyCode: Function;
}

export default function Credits({ setCurrencyCode }: Props): ReactElement {
    const { useTranslation } = i18next;
    const { i18n, t } = useTranslation(['common']);
    const [language, setLanguage] = React.useState(i18n.language);
    const [selectedCurrency, setSelectedCurrency] = React.useState('EUR');
    const [selectedCountry, setSelectedCountry] = React.useState('DE');
    const [openLanguageModal, setLanguageModalOpen] = React.useState(false);
    const [userLang, setUserLang] = React.useState('en');

    const handleLanguageModalClose = () => {
        setLanguageModalOpen(false);
    };
    const handleLanguageModalOpen = () => {
        setLanguageModalOpen(true);
    };

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('language')) {
                let userLang = localStorage.getItem('language');
                if (userLang) setUserLang(userLang);
            }
        }
    }, []);


    return (
        <>
            <div className={styles.lngSwitcher + ' mapboxgl-map'}>
                <div
                    onClick={() => {
                        setLanguageModalOpen(true);
                    }}
                >
                    {`🌐 ${language ? language.toUpperCase() : ''
                        } • ${selectedCurrency}`}
                </div>
                <a
                    rel="noopener noreferrer"
                    href={`https://a.plant-for-the-planet.org/${userLang}/imprint`}
                    target={'_blank'}
                >
                    {t('common:imprint')}
                </a>
                <a
                    rel="noopener noreferrer"
                    href={`https://a.plant-for-the-planet.org/${userLang}/privacy-terms`}
                    target={'_blank'}
                >
                    {t('common:privacyAndTerms')}
                </a>

                <a
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        overflow: 'visible',
                    }}
                >
                    <div style={{ width: 'fit-content' }}>
                        <div className={styles.popover}>
                            {t('common:mapInfo')}
                            <div
                                className={styles.popoverContent}
                                style={{ left: '-270px', top: '-140px' }}
                            >
                                <a>
                                    Esri Community Maps Contributors, Esri, HERE, Garmin,
                                    METI/NASA, USGS
                    <br />
                    Imagery: Esri, Maxar, Earthstar Geographics, CNES/Airbus DS,
                    USDA FSA, USGS, Aerogrid, IGN, IGP, and the GIS User
                    Community
                  </a>
                            </div>
                        </div>
                    </div>
                </a>

                <a
                    rel="noopener noreferrer"
                    href="mailto:support@plant-for-the-planet.org"
                    target={'_blank'}
                >
                    {t('common:contact')}
                </a>
            </div>
            <SelectLanguageAndCountry
                openModal={openLanguageModal}
                handleModalClose={handleLanguageModalClose}
                language={language}
                setLanguage={setLanguage}
                setSelectedCurrency={setSelectedCurrency}
                selectedCountry={selectedCountry}
                setSelectedCountry={setSelectedCountry}
                setCurrencyCode={setCurrencyCode}
            />
        </>
    )
}
