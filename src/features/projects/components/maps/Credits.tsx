import React, { ReactElement } from 'react';
import styles from '../../styles/ProjectsMap.module.scss';
import i18next from '../../../../../i18n';
import SelectLanguageAndCountry from '../../../common/Layout/Footer/SelectLanguageAndCountry';
import tenantConfig from '../../../../../tenant.config';
import DarkModeSwitch from '../../../common/Layout/DarkModeSwitch.tsx';
import { useRouter } from 'next/router';

const config = tenantConfig();

interface Props {
    setCurrencyCode: Function;
}

export default function Credits({ setCurrencyCode }: Props): ReactElement {
    const { useTranslation } = i18next;
    const { i18n, t } = useTranslation(['common', 'maps']);
    const [language, setLanguage] = React.useState(i18n.language);
    const [selectedCurrency, setSelectedCurrency] = React.useState('EUR');
    const [selectedCountry, setSelectedCountry] = React.useState('DE');
    const [openLanguageModal, setLanguageModalOpen] = React.useState(false);
    

    const handleLanguageModalClose = () => {
        setLanguageModalOpen(false);
    };
    const handleLanguageModalOpen = () => {
        setLanguageModalOpen(true);
    };
    const router = useRouter();
    const isEmbed = router.query.embed === 'true';

  
    return (
            <>
           
            <div className={styles.lngSwitcher + ' mapboxgl-map'}>
                {config.darkModeEnabled && <DarkModeSwitch />}
                {isEmbed? null :
                <div
                    onClick={() => {
                        setLanguageModalOpen(true);
                    }}
                >
                    {`🌐 ${language ? language.toUpperCase() : ''
                        } • ${selectedCurrency}`}
                </div>
                }
                {(process.env.TENANT === "ttc" || process.env.TENANT === "planet") && (!isEmbed)? < a
                    rel="noopener noreferrer"
                    href={`https://www.thegoodshop.org/de/shop/`}
                    target={'_blank'}
                >
                    {t('common:shop')}
                </a> : null}
               
                {/* {config.statusURL ? <a
                    rel="noopener noreferrer"
                    href={config.statusURL} 
                    target={'_blank'}
                >
                    {t('common:status')}
                </a> : null} */}
                <a
                    rel="noopener noreferrer"
                    href={`https://status.pp.eco/`}
                    target={ isEmbed? '_top': '_blank'}
                >
                    {t('common:status')}
                </a>
                { isEmbed? null: 
                <a
                    rel="noopener noreferrer"
                    href={`https://pp.eco/legal/${i18n.language}/imprint`}
                    target={'_blank'}
                >
                    {t('common:imprint')}
                </a>
                }
                { isEmbed? null: 
                <a
                    rel="noopener noreferrer"
                    href={`https://pp.eco/legal/${i18n.language}/privacy`}
                    target={'_blank'}
                >
                    {t('common:privacy')}
                </a>
                }
                { isEmbed? null: 
                <a
                    rel="noopener noreferrer"
                    href={`https://pp.eco/legal/${i18n.language}/terms`}
                    target={'_blank'}
                >
                    {t('common:terms')}
                </a>
                }
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
                                style={{ left: '-270px', top: '-240px' }}
                            >
                                <b>{t('maps:baseLayer')}</b>
                                <p>Esri Community Maps Contributors, Esri, HERE, Garmin, METI/NASA, USGS </p>
                                <p>World Imagery: Esri, Maxar, Earthstar Geographics, CNES/Airbus DS, USDA FSA, USGS, Aerogrid, IGN, IGP, and the GIS User Community</p>
                                <b>{t('maps:satelliteImagery')}</b>
                                <p>Image courtesy of Planet Labs, Inc</p>
                                <p>Copernicus Sentinel data 2017-2021</p>
                                <p>Landsat-8 image courtesy of the U.S. Geological Survey</p>
                            </div>
                        </div>
                    </div>
                </a>
                { isEmbed? null: 
                <a
                    rel="noopener noreferrer"
                    href="mailto:support@plant-for-the-planet.org"
                    target={'_blank'}
                >
                    {t('common:contact')}
                </a>
                }

                {
                    isEmbed?
                    (
                    <span>
                        Powered by
                      <a href="https://www.plant-for-the-planet.org"> Plant-for-the-Planet</a>
                      </span>
                      
                    ): null
                }
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
        </>)
}
