import React, { ReactElement } from 'react';
import { Modal } from '@material-ui/core';
import CancelIcon from '../../../../../public/assets/images/icons/CancelIcon';
import tenantConfig from '../../../../../tenant.config';
import i18next from '../../../../../i18n';

const tenantConfiguration = tenantConfig();
const { useTranslation } = i18next;

interface Props {}

export default function index({}: Props): ReactElement {
  const [showPlanetModal, setShowPlanetModal] = React.useState(false);
  const [openModal, setModalOpen] = React.useState(true);
  const [userLang, setUserLang] = React.useState('');
  const [countryCode, setCountryCode] = React.useState('');
  const { t, ready, i18n } = useTranslation('popup');

  React.useEffect(() => {
    let prev = localStorage.getItem('showPlanetModal');
    if (!prev) {
      setShowPlanetModal(true);      
    } else {
      setShowPlanetModal(prev === 'true');
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem('showPlanetModal', showPlanetModal);
  }, [showPlanetModal]);


  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      let userLang = localStorage.getItem('language');
      let countryCode = localStorage.getItem('countryCode');
      setUserLang(userLang);
      setCountryCode(countryCode);
    }
  }, []);

  const closePlanetModal = () => {
    setShowPlanetModal(false);
    setModalOpen(false);
    localStorage.setItem('showPlanetModal', 'false');
  };
  return ready ? (
    <>
      {tenantConfiguration.tenantName === 'planet' &&
        showPlanetModal && (
          <Modal
            style={{
              display: 'flex',
              height: '100%',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            open={openModal}
            onClose={closePlanetModal}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            <div
              style={{
                backgroundColor: 'white',
                minHeight: '300px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '30px',
                borderRadius: '10px',
                maxWidth: '580px',
                position: 'relative',
                flexDirection: 'column',
              }}
            >
              <h2 style={{ fontWeight: 'bold' }}>
              {t('title')}
              </h2>
              <p style={{ margin: '16px auto' }}>
              {t('text')}
              </p>
              <a
                target="_blank"
                style={{ fontWeight: 'bold', color: '#68B030' }}
                rel="noopener noreferrer"
                href={`https://a.plant-for-the-planet.org/${i18n.language}/yucatan-reports/?utm_source=planetapp&utm_medium=banner&utm_campaign=yucatan_reports`}
              >
                {t('btnText')} {'>'}
              </a>
              <div
                onClick={closePlanetModal}
                style={{
                  position: 'absolute',
                  right: '18px',
                  top: '18px',
                  cursor: 'pointer',
                }}
              >
                <CancelIcon width={'20px'} />
              </div>
            </div>
          </Modal>
        )}
    </>
  ): <></>;
}