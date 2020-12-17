import React, { ReactElement } from 'react';
import { Modal } from '@material-ui/core';
import CancelIcon from '../../../../../public/assets/images/icons/CancelIcon';
import tenantConfig from '../../../../../tenant.config';

const tenantConfiguration = tenantConfig();

interface Props {}

export default function index({}: Props): ReactElement {
  const [hidePlanetModal, setHidePlanetModal] = React.useState(false);
  const [openModal, setModalOpen] = React.useState(true);
  const [userLang, setUserLang] = React.useState('');
  const [countryCode, setCountryCode] = React.useState('');
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      let userLang = localStorage.getItem('language');
      let countryCode = localStorage.getItem('countryCode');
      let hidePlanetModal = localStorage.getItem('hidePlanetModal');
      if (hidePlanetModal === 'true') {
        setHidePlanetModal(true);
      }
      setUserLang(userLang);
      setCountryCode(countryCode);
    }
  }, []);

  const closePlanetModal = () => {
    setHidePlanetModal(true);
    setModalOpen(false);
    localStorage.setItem('hidePlanetModal', 'true');
  };
  return (
    <>
      {tenantConfiguration.tenantName === 'planet' &&
        (countryCode === 'DE' || userLang === 'de') &&
        hidePlanetModal !== true && (
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
                Liebe Unterstützerinnen und Unterstützer,
              </h2>
              <p style={{ margin: '16px auto' }}>
                viele von Ihnen und euch haben den Artikel in der ZEIT gelesen,
                der heute über Plant-for-the-Planet erschienen ist. Dieser
                Artikel trifft uns als Stiftung, er trifft mich persönlich als
                Gründer, weil er Dinge falsch darstellt, mit Vermutungen und
                Unterstellungen arbeitet, Erklärung und Fakten auslässt. Sein
                Ziel ist es, die Stiftung, die daran beteiligten Personen und
                unser gemeinsames Ziel, Milliarden Bäume zu pflanzen, zu
                beschädigen.
              </p>
              <a
                target="_blank"
                style={{ fontWeight: 'bold', color: '#68B030' }}
                rel="noopener noreferrer"
                href={
                  'https://blog.plant-for-the-planet.org/de/2020/liebe-unterstuetzerinnen-und-unterstuetzer/?utm_source=planetapp&utm_medium=banner&utm_campaign=zeit'
                }
              >
                Brief Lesen {'>'}
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
