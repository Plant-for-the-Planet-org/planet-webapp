import { Popper } from '@mui/material';
import React from 'react';
import styles from './FirePopup.module.scss';
import FireIcon from '../icons/FireIcon';
import FirePopupIcon from '../icons/FirePopupIcon';
import InfoIconPopup from '../components/InfoIconPopup';
import { useTranslation } from 'react-i18next';
import RightArrowIcon from '../icons/RightArrowIcon';

interface Props {
  isOpen: boolean;
}

export default function FirePopup({ isOpen }: Props) {
  const anchorRef = React.useRef(null);
  const [arrowRef, setArrowRef] = React.useState(null);
  const [showPopup, setShowPopup] = React.useState(isOpen);
  const { t } = useTranslation('projectDetails');

  return (
    <>
      <Popper
        id="fire-popup"
        open={showPopup}
        anchorEl={anchorRef.current}
        placement="top"
        disablePortal={false}
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
        <div className={styles.popupContainer}>
          <div className={styles.popupTitle}>
            <div className={styles.titleText}>
              <FirePopupIcon width={18} /> Forest Fire
            </div>
            <p className={styles.timeDuration}>
              21h ago
              <InfoIconPopup width={9} height={9} color={'#828282'}>
                <div className={styles.infoIconPopupContainer}>
                  {t('firePopupText')}
                </div>
              </InfoIconPopup>
            </p>
          </div>
          <div className={styles.popupText}>
            <p className={styles.coordinates}>18.71122, -87.71138</p>
            <p>
              <span>High</span> alert confidence
            </p>
            <div className={styles.setUpAlertsContainer}>
              <p className={styles.setUpAlerts}>
                Set up alerts with <span>FireAlert</span>
              </p>
              <RightArrowIcon width={5} height={8} color={'#4F4F4F'} />
            </div>
          </div>
        </div>
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
