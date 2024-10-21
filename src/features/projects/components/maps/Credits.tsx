import React, { ReactElement } from 'react';
import styles from '../../styles/ProjectsMap.module.scss';
import { useLocale, useTranslations } from 'next-intl';
import SelectLanguageAndCountry from '../../../common/Layout/Footer/SelectLanguageAndCountry';
import { ParamsContext } from '../../../common/Layout/QueryParamsContext';
import { useTenant } from '../../../common/Layout/TenantContext';

interface Props {
  setCurrencyCode: Function;
  isMobile?: boolean;
}

export default function Credits({
  setCurrencyCode,
  isMobile,
}: Props): ReactElement {
  const { tenantConfig } = useTenant();
  const tCommon = useTranslations('Common');
  const tMaps = useTranslations('Maps');
  const locale = useLocale();
  const [selectedCurrency, setSelectedCurrency] = React.useState('EUR');
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
  const separator = isMobile && !isEmbed ? '|' : null;
  return (
    <>
      <div className={styles.lngSwitcher + ' mapboxgl-map'}>
        {/* {tenantConfig.config.darkModeEnabled && <DarkModeSwitch />} */}
        {isEmbed ? null : (
          <div
            onClick={() => {
              setLanguageModalOpen(true);
            }}
          >
            {`🌐 ${locale ? locale.toUpperCase() : ''} • ${selectedCurrency}`}
          </div>
        )}
        {separator}
        {(tenantConfig.config.slug === 'ttc' ||
          tenantConfig.config.slug === 'planet') &&
        !isEmbed ? (
          <a
            rel="noopener noreferrer"
            href={`https://www.thegoodshop.org/de/shop/`}
            target={'_blank'}
          >
            {tCommon('shop')}
          </a>
        ) : null}
        {separator}
        <a
          rel="noopener noreferrer"
          href={`https://status.pp.eco/`}
          target={isEmbed ? '_top' : '_blank'}
        >
          {tCommon('status')}
        </a>
        {isMobile && '|'}
        {!isEmbed && (
          <a
            rel="noopener noreferrer"
            href={`https://pp.eco/legal/${locale}/imprint`}
            target={'_blank'}
          >
            {tCommon('imprint')}
          </a>
        )}
        {separator}
        {!isEmbed && (
          <a
            rel="noopener noreferrer"
            href={`https://pp.eco/legal/${locale}/privacy`}
            target={'_blank'}
          >
            {tCommon('privacy')}
          </a>
        )}
        {separator}
        {!isEmbed && (
          <a
            rel="noopener noreferrer"
            href={`https://pp.eco/legal/${locale}/terms`}
            target={'_blank'}
          >
            {tCommon('terms')}
          </a>
        )}
        {separator}
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
              {tCommon('mapInfo')}
              <div
                className={styles.popoverContent}
                style={{ left: '-270px', top: '-240px' }}
              >
                <b>{tMaps('baseLayer')}</b>
                <p>
                  Esri Community Maps Contributors, Esri, HERE, Garmin,
                  METI/NASA, USGS{' '}
                </p>
                <p>
                  World Imagery: Esri, Maxar, Earthstar Geographics, CNES/Airbus
                  DS, USDA FSA, USGS, Aerogrid, IGN, IGP, and the GIS User
                  Community
                </p>
                <b>{tMaps('satelliteImagery')}</b>
                <p>Image courtesy of Planet Labs, Inc</p>
                <p>Copernicus Sentinel data 2017-2021</p>
                <p>Landsat-8 image courtesy of the U.S. Geological Survey</p>
              </div>
            </div>
          </div>
        </a>
        {isMobile && '|'}
        {!isEmbed && (
          <a
            rel="noopener noreferrer"
            href="mailto:support@plant-for-the-planet.org"
            target={'_blank'}
          >
            {tCommon('contact')}
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
        setSelectedCurrency={setSelectedCurrency}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        setCurrencyCode={setCurrencyCode}
      />
    </>
  );
}
