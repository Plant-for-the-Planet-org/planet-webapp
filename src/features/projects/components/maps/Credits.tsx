import React, { ReactElement } from 'react';
import styles from '../../styles/ProjectsMap.module.scss';
import { useTranslation } from 'next-i18next';
import SelectLanguageAndCountry from '../../../common/Layout/Footer/SelectLanguageAndCountry';
import tenantConfig from '../../../../../tenant.config';
import DarkModeSwitch from '../../../common/Layout/DarkModeSwitch.tsx';
import { ParamsContext } from '../../../common/Layout/QueryParamsContext';

const config = tenantConfig();

interface Props {
  setCurrencyCode: Function;
}

export default function Credits({ setCurrencyCode }: Props): ReactElement {
  const { i18n, t } = useTranslation(['common', 'maps']);
  const [selectedCurrency, setSelectedCurrency] = React.useState('EUR');
  const [language, setLanguage] = React.useState(i18n.language);
  const [selectedCountry, setSelectedCountry] = React.useState('DE');
  const [openLanguageModal, setLanguageModalOpen] = React.useState(false);

  const handleLanguageModalClose = () => {
    setLanguageModalOpen(false);
  };

  const { embed } = React.useContext(ParamsContext);

  const isEmbed = embed === 'true';

  React.useEffect(() => {
    if (typeof Storage !== 'undefined') {
      //fetching currencycode from browser's localstorage
      if (localStorage.getItem('currencyCode')) {
        const currencyCode = localStorage.getItem('currencyCode');
        if (currencyCode) setSelectedCurrency(currencyCode);
      }
      //fetching country code from browser's localstorage
      if (localStorage.getItem('countryCode')) {
        const countryCode = localStorage.getItem('countryCode');
        if (countryCode) setSelectedCountry(countryCode);
      }
    }
  }, []);

  return (
    <>
      <div className={styles.lngSwitcher + ' mapboxgl-map'}>
        {config.darkModeEnabled && <DarkModeSwitch />}
        {isEmbed ? null : (
          <div
            onClick={() => {
              setLanguageModalOpen(true);
            }}
          >
            {`🌐 ${
              i18n.language ? i18n.language.toUpperCase() : ''
            } • ${selectedCurrency}`}
          </div>
        )}
        {(process.env.TENANT === 'ttc' || process.env.TENANT === 'planet') &&
        !isEmbed ? (
          <a
            rel="noopener noreferrer"
            href={`https://www.thegoodshop.org/de/shop/`}
            target={'_blank'}
          >
            {t('common:shop')}
          </a>
        ) : null}

        <a
          rel="noopener noreferrer"
          href={`https://status.pp.eco/`}
          target={isEmbed ? '_top' : '_blank'}
        >
          {t('common:status')}
        </a>
        {!isEmbed && (
          <a
            rel="noopener noreferrer"
            href={`https://pp.eco/legal/${i18n.language}/imprint`}
            target={'_blank'}
          >
            {t('common:imprint')}
          </a>
        )}
        {!isEmbed && (
          <a
            rel="noopener noreferrer"
            href={`https://pp.eco/legal/${i18n.language}/privacy`}
            target={'_blank'}
          >
            {t('common:privacy')}
          </a>
        )}
        {!isEmbed && (
          <a
            rel="noopener noreferrer"
            href={`https://pp.eco/legal/${i18n.language}/terms`}
            target={'_blank'}
          >
            {t('common:terms')}
          </a>
        )}
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
                <p>
                  Esri Community Maps Contributors, Esri, HERE, Garmin,
                  METI/NASA, USGS{' '}
                </p>
                <p>
                  World Imagery: Esri, Maxar, Earthstar Geographics, CNES/Airbus
                  DS, USDA FSA, USGS, Aerogrid, IGN, IGP, and the GIS User
                  Community
                </p>
                <b>{t('maps:satelliteImagery')}</b>
                <p>Image courtesy of Planet Labs, Inc</p>
                <p>Copernicus Sentinel data 2017-2021</p>
                <p>Landsat-8 image courtesy of the U.S. Geological Survey</p>
              </div>
            </div>
          </div>
        </a>
        {!isEmbed && (
          <a
            rel="noopener noreferrer"
            href="mailto:support@plant-for-the-planet.org"
            target={'_blank'}
          >
            {t('common:contact')}
          </a>
        )}

        {isEmbed && (
          <span>
            Powered by
            <a href="https://www.plant-for-the-planet.org" target="_top">
              {' '}
              Plant-for-the-Planet
            </a>
          </span>
        )}
      </div>
      <SelectLanguageAndCountry
        openModal={openLanguageModal}
        handleModalClose={handleLanguageModalClose}
        language={i18n.language}
        setLanguage={setLanguage}
        setSelectedCurrency={setSelectedCurrency}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        setCurrencyCode={setCurrencyCode}
      />
    </>
  );
}
