import { Popper } from '@mui/material';
import React from 'react';
import styles from './FirePopup.module.scss';
import FireIcon from '../icons/FireIcon';
import FirePopupIcon from '../icons/FirePopupIcon';
import InfoIconPopup from '../components/InfoIconPopup';
import RightArrowIcon from '../icons/RightArrowIcon';
import { useTranslations } from 'next-intl';

interface Props {
  isOpen: boolean;
}

// Currently contains hardcoded data, component would need refactoring based on the api/data when available.

export default function FirePopup({ isOpen }: Props) {
  const anchorRef = React.useRef(null);
  const [arrowRef, setArrowRef] = React.useState<HTMLSpanElement | null>(null);
  const [showPopup, setShowPopup] = React.useState(isOpen);
  const t = useTranslations('ProjectDetails');

  return (
    <>
      <Popper
        id="fire-popup"
        open={showPopup}
        anchorEl={anchorRef.current}
        placement="top"
        disablePortal={true}
        onMouseLeave={() => setShowPopup(false)}
        onMouseEnter={() => setShowPopup(true)}
        modifiers={[
          {
            name: 'arrow',
            enabled: true,
            options: {
              element: arrowRef,
            },
          },
          {
            name: 'flip',
            enabled: false,
          },
        ]}
      >
        <span className={styles.arrow} ref={setArrowRef} />
        <aside className={styles.popupContainer}>
          <header className={styles.popupTitle}>
            <h2 className={styles.titleText}>
              <FirePopupIcon width={18} /> {t('forestFire')}
            </h2>
            <p className={styles.timeDuration}>
              {t('hoursAgo', {
                hours: 21,
              })}
              <InfoIconPopup width={9} height={9} color={'#828282'}>
                <div className={styles.infoIconPopupContainer}>
                  {t('firePopupText')}
                </div>
              </InfoIconPopup>
            </p>
          </header>
          <div className={styles.popupText}>
            <p className={styles.coordinates}>18.71122, -87.71138</p>
            <p>
              {t.rich('highAlertConfidenceText', {
                important: (chunks) => <span>{chunks}</span>,
              })}
            </p>
            <div className={styles.setUpAlertsContainer}>
              <p className={styles.setUpAlerts}>
                {t.rich('setUpAlertsText', {
                  important: (chunks) => <span>{chunks}</span>,
                })}
              </p>
              <RightArrowIcon width={5} color={'#4F4F4F'} />
            </div>
          </div>
        </aside>
      </Popper>
      <div
        ref={anchorRef}
        onMouseEnter={() => setShowPopup(true)}
        onMouseLeave={() => setShowPopup(false)}
        className={styles.fireIcon}
      >
        <FireIcon width={36} />
      </div>
    </>
  );
}
