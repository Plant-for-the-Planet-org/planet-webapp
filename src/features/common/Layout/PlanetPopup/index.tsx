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
  const { t, ready } = useTranslation(['leaderboard']);

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
        (countryCode === 'DE' || userLang === 'de') &&
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
                Liebe Unterstützerinnen und Unterstützer,
              </h2>
              <p style={{ margin: '16px auto' }}>
                viele von Ihnen und euch haben den Artikel in der ZEIT gelesen, 
                der am 16. Dezember über Plant-for-the-Planet erschienen ist. 
                Dieser Artikel trifft uns als Stiftung und mich persönlich als 
                Gründer sehr, weil er ein völliges Zerrbild zeichnet, Sachverhalte 
                falsch darstellt und mit Vermutungen und Unterstellungen arbeitet.
                <br/><br/>
                Wir sind als Plant-for-the-Planet gewohnt, viele Fragen von 
                Medienvertretern zu uns, den Projekten und den Pflanzgebieten zu 
                bekommen. Diese Fragen beantworten wir immer, da wir seit 
                Gründungsbeginn transparent arbeiten und wissen, wie wichtig das 
                Vertrauen in unser Tun ist.
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
  ): <></>;
}
