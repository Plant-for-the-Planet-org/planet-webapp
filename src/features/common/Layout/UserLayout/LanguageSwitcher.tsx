import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import SelectLanguageAndCountry from '../Footer/SelectLanguageAndCountry';
import GlobeIcon from '../../../../../public/assets/images/icons/Sidebar/Globe';
import IconContainer from './IconContainer';
import styles from './UserLayout.module.scss';
import { useCurrencyStore } from '../../../../stores/currencyStore';

function LanguageSwitcher() {
  const locale = useLocale();

  const [openModal, setOpenModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('DE');
  // store: state
  const currencyCode = useCurrencyStore((state) => state.currencyCode);

  useEffect(() => {
    if (typeof Storage !== 'undefined') {
      //fetching country code from browser's localstorage
      if (localStorage.getItem('countryCode')) {
        const countryCode = localStorage.getItem('countryCode');
        if (countryCode) setSelectedCountry(countryCode);
      }
    }
  }, []);

  return (
    <>
      <div className={styles.navLink}>
        <IconContainer>
          <GlobeIcon />
        </IconContainer>
        <button
          className={styles.navLinkTitle}
          onClick={() => {
            setOpenModal(true); // open language and country change modal
          }}
        >
          {`${locale ? locale.toUpperCase() : ''} • ${currencyCode}`}
        </button>
      </div>
      <SelectLanguageAndCountry
        openModal={openModal}
        handleModalClose={() => setOpenModal(false)}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
      />
    </>
  );
}

export default LanguageSwitcher;
