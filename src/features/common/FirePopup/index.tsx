import { Popper } from '@mui/material';
import { useTranslations } from 'next-intl';
import React, { useMemo } from 'react';
import RightArrowIcon from '../../../../public/assets/images/icons/projectV2/RightArrowIcon';
import type { FireFeature } from '../types/fireLocation';
import InfoIconPopup from '../../projectsV2/ProjectDetails/components/microComponents/InfoIconPopup';
import FireIcon from '../../../../public/assets/images/icons/FireIcon';
import FirePopupIcon from '../../../../public/assets/images/icons/FirePopupIcon';
import styles from './FirePopup.module.scss';
import { userAgent } from 'next/server';

interface Props {
  isOpen: boolean;
  feature: FireFeature;
}

// Currently contains hardcoded data, component would need refactoring based on the api/data when available.

export default function FirePopup({ isOpen, feature }: Props) {
  const anchorRef = React.useRef(null);
  const [arrowRef, setArrowRef] = React.useState<HTMLSpanElement | null>(null);
  const [showPopup, setShowPopup] = React.useState(isOpen);
  const tProjectDetails = useTranslations('ProjectDetails');

  const hourseAgo = useMemo(() => {
    const ms = Math.abs(
      new Date().getTime() - new Date(feature.properties.eventDate).getTime()
    );
    return Math.round(ms / (1000 * 60 * 60));
  }, []);

  const alertConfidence = useMemo(() => {
    switch (feature.properties.confidence) {
      case 'high':
        return 'highAlertConfidenceText';
      case 'medium':
        return 'mediumAlertConfidenceText';
      case 'low':
        return 'lowAlertConfidenceText';
      default:
        return 'defaultAlertConfidenceText';
    }
  }, []);

  const firealertAppLink = useMemo(() => {
    let link = 'https://www.plant-for-the-planet.org/firealert/';
    if (navigator.userAgent) {
      console.log(navigator.userAgent);
      if (/android/i.test(navigator.userAgent.toLowerCase())) {
        link = 'https://play.google.com/store/apps/details?id=eco.pp.firealert';
      } else if (/iphone/.test(navigator.userAgent.toLowerCase())) {
        link = 'https://apps.apple.com/app/fire-alert-for-forests/id1667307676';
      }
    }
    return link;
  }, []);

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
              <FirePopupIcon width={18} /> {tProjectDetails('forestFire')}
            </h2>
            <p className={styles.timeDuration}>
              {tProjectDetails('hoursAgo', {
                hours: hourseAgo,
              })}
              <InfoIconPopup width={9} height={9} color={'#828282'}>
                <div className={styles.infoIconPopupContainer}>
                  {tProjectDetails('firePopupText')}
                </div>
              </InfoIconPopup>
            </p>
          </header>
          <div className={styles.popupText}>
            <p className={styles.coordinates}>
              {feature.geometry.coordinates[0]},{' '}
              {feature.geometry.coordinates[1]}
            </p>
            <p>
              {tProjectDetails.rich(alertConfidence as any, {
                important: (chunks) => <span>{chunks}</span>,
              })}
            </p>
            <a
              className={styles.setUpAlertsContainer}
              href={firealertAppLink}
              target="_blank"
              rel="noreferrer"
            >
              <p className={styles.setUpAlerts}>
                {tProjectDetails.rich('setUpAlertsText', {
                  important: (chunks) => <span>{chunks}</span>,
                })}
              </p>
              <RightArrowIcon width={5} color={'#4F4F4F'} />
            </a>
          </div>
        </aside>
      </Popper>
      <div
        ref={anchorRef}
        onMouseEnter={() => setShowPopup(true)}
        onMouseLeave={() => setShowPopup(false)}
        className={styles.fireIcon}
      >
        <FireIcon width={24} height={28} />
      </div>
    </>
  );
}
