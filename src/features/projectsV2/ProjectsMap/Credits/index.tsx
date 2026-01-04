import type { ReactElement } from 'react';

import { useEffect, useState } from 'react';
import styles from './Credits.module.scss';
import { useLocale, useTranslations } from 'next-intl';
import SelectLanguageAndCountry from '../../../common/Layout/Footer/SelectLanguageAndCountry';
import { useTenant } from '../../../common/Layout/TenantContext';
import { useQueryParamStore } from '../../../../stores/queryParamStore';

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
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const [selectedCountry, setSelectedCountry] = useState('DE');
  const [openLanguageModal, setLanguageModalOpen] = useState(false);

  const isEmbedMode = useQueryParamStore((state) => state.embed === 'true');

  const handleLanguageModalClose = () => {
    setLanguageModalOpen(false);
  };

  useEffect(() => {
    if (typeof Storage !== 'undefined') {
      //fetching currency code from browser's localstorage
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

  const separator = isMobile && !isEmbedMode ? '|' : null;

  return (
    <>
      <div className={styles.lngSwitcher + ' mapboxgl-map'}>
        {isEmbedMode ? null : (
          <div
            onClick={() => {
              setLanguageModalOpen(true);
            }}
            className={styles.languageModalButton}
          >
            {`🌐 ${locale ? locale.toUpperCase() : ''} • ${selectedCurrency}`}
          </div>
        )}
        {separator}
        {(tenantConfig.config.slug === 'ttc' ||
          tenantConfig.config.slug === 'planet') &&
        !isEmbedMode ? (
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
          target={isEmbedMode ? '_top' : '_blank'}
        >
          {tCommon('status')}
        </a>
        {isMobile && '|'}
        {!isEmbedMode && (
          <a
            rel="noopener noreferrer"
            href={`https://pp.eco/legal/${locale}/imprint`}
            target={'_blank'}
          >
            {tCommon('imprint')}
          </a>
        )}
        {separator}
        {!isEmbedMode && (
          <a
            rel="noopener noreferrer"
            href={`https://pp.eco/legal/${locale}/privacy`}
            target={'_blank'}
          >
            {tCommon('privacy')}
          </a>
        )}
        {separator}
        {!isEmbedMode && (
          <a
            rel="noopener noreferrer"
            href={`https://pp.eco/legal/${locale}/terms`}
            target={'_blank'}
          >
            {tCommon('terms')}
          </a>
        )}
        {separator}
        <div className={styles.mapCreditsContainer}>
          <div className={styles.popover}>
            <span className={styles.mapCreditsTrigger}>
              {tCommon('mapInfo')}
            </span>
            <div
              className={styles.popoverContent}
              style={{ left: '-270px', top: '-240px' }}
            >
              <b>{tMaps('baseLayer')}</b>
              <p>
                Esri Community Maps Contributors, Esri, HERE, Garmin, METI/NASA,
                USGS{' '}
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
        {isMobile && '|'}
        {!isEmbedMode && (
          <a
            rel="noopener noreferrer"
            href="mailto:support@plant-for-the-planet.org"
            target={'_blank'}
          >
            {tCommon('contact')}
          </a>
        )}
        {isEmbedMode && (
          <span>
            Powered by
            <a href="https://www.plant-for-the-planet.org" target="_top">
              {' Plant-for-the-Planet'}
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
