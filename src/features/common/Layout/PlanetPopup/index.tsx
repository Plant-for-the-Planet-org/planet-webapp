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
  const { t, ready, i18n } = useTranslation(['leaderboard']);

  const [loading, setLoading] = React.useState(true);
  console.log(i18n.language);
  function loadCondition() {
    let prev = localStorage.getItem('showPlanetModal');
    if (!prev) {
      setShowPlanetModal(true);
      localStorage.setItem('showPlanetModal', 'true');
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    } else {
      setShowPlanetModal(prev === 'true');
      localStorage.setItem('showPlanetModal', prev === 'true');
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  }

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      let userLang = localStorage.getItem('language');
      let countryCode = localStorage.getItem('countryCode');
      setUserLang(userLang);
      setCountryCode(countryCode);
      loadCondition();
    }
  }, []);

  const closePlanetModal = () => {
    setShowPlanetModal(false);
    setModalOpen(false);
    localStorage.setItem('showPlanetModal', 'false');
  };

  return ready && !loading ? (
    <>
      {tenantConfiguration.tenantName === 'planet' &&
        // (countryCode === 'DE' || i18n.language === 'de') &&
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
                wir sind immer noch tief getroffen von der Berichterstattung
                der ‚Zeit’, weil unsere Arbeit in Constitución in großem Umfang
                in Zweifel gezogen wurde. Wir haben mittlerweile sehr viel
                Zuspruch bekommen, aber leider auch viel Kritik.
                <br />
                <br />
                Wir haben aus dem Bericht und den Reaktionen darauf die
                Schlussfolgerung gezogen, dass wir Dinge besser machen
                müssen – in der Dokumentation und der Kommunikation.
              </p>
              <a
                target="_blank"
                style={{ fontWeight: 'bold', color: '#68B030' }}
                rel="noopener noreferrer"
                href={
                  'https://blog.plant-for-the-planet.org/de/2020/transparenz-durch-pwc-kamerateams-und-expertengremium/?utm_source=planetapp&utm_medium=banner&utm_campaign=transparency'
                }
              >
                Brief Lesen {'>'}
              </a>
              <p style={{ margin: '16px auto' }}>
              PS. Felix im Interview mit dem TV Moderatoren Franz Alt und Frank Farensi zu den Vorwürfen der Zeit <a href={'https://youtu.be/V_Kr3njVDpM'}>https://youtu.be/V_Kr3njVDpM</a>
              </p>

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
  ) : (
    <></>
  );
}
