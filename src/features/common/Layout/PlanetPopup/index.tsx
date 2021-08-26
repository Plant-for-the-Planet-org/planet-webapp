import React, { ReactElement } from 'react';
import { Modal } from '@material-ui/core';
import CancelIcon from '../../../../../public/assets/images/icons/CancelIcon';
import tenantConfig from '../../../../../tenant.config';

const tenantConfiguration = tenantConfig();

interface Props {}

export default function index({}: Props): ReactElement {
  const [hidePlanetModalNew, setHidePlanetModalNew] = React.useState(false);
  const [openModal, setModalOpen] = React.useState(true);
  const [userLang, setUserLang] = React.useState('');
  const [countryCode, setCountryCode] = React.useState('');
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      let userLang = localStorage.getItem('language');
      let countryCode = localStorage.getItem('countryCode');

      //remove old key
      let hidePlanetModalOld = localStorage.getItem('hidePlanetModal');
      if(hidePlanetModalOld) {
        localStorage.removeItem('hidePlanetModal');
      }

      let hidePlanetModalNew = localStorage.getItem('hidePlanetModalNew');
      if (hidePlanetModalNew === 'true') {
        setHidePlanetModalNew(true);
      }
      setUserLang(userLang);
      setCountryCode(countryCode);
    }
  }, []);

  const closePlanetModal = () => {
    setHidePlanetModalNew(true);
    setModalOpen(false);
    localStorage.setItem('hidePlanetModalNew', 'true');
  };
  return (
    <>
      {tenantConfiguration.tenantName === 'planet' &&
        (countryCode === 'DE' || userLang === 'de') &&
        hidePlanetModalNew !== true && (
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
                minHeight: '200px',
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
              Transparenzbericht 2020 erschienen
              </h2>
              <p style={{ margin: '16px auto' }}>
               Acht Jahre mit uneingeschränkten Bestätigungsvermerken - Erleben Sie Plant-for-the-Planet in testierten Zahlen, Daten und spannenden Grafiken.
              </p>
              <a
                target="_blank"
                style={{ fontWeight: 'bold', color: '#68B030' }}
                rel="noopener noreferrer"
                href={
                  'https://drive.google.com/file/d/11vdq-uVS-HPECtUGEEy5EuUaBHeGpzID/view'
                }
              >
                Los geht's! {'>'}
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
  );
}
