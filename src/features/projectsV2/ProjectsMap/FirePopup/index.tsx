import type { FireFeature } from '../../../common/types/fireLocation';
import type { PopperProps } from '@mui/material';
import type { Modifier } from '@popperjs/core';

import { Popper } from '@mui/material';
import { useTranslations } from 'next-intl';
import React, { useEffect, useMemo } from 'react';
import RightArrowIcon from '../../../../../public/assets/images/icons/projectV2/RightArrowIcon';
import InfoIconPopup from '../../ProjectDetails/components/microComponents/InfoIconPopup';
import FireIcon from '../../../../../public/assets/images/icons/FireIcon';
import FirePopupIcon from '../../../../../public/assets/images/icons/FirePopupIcon';
import styles from './FirePopup.module.scss';
import { getDeviceType } from '../../../../utils/projectV2';

interface Props {
  isOpen: boolean;
  feature: FireFeature;
}
type ConfidencesType =
  | 'highAlertConfidenceText'
  | 'mediumAlertConfidenceText'
  | 'lowAlertConfidenceText';

function popperModifiers(options: {
  arrowRef: React.SetStateAction<HTMLElement | null>;
  clippingBoundary: HTMLElement | null;
}): Partial<Modifier<any, any>>[] | undefined {
  return [
    {
      name: 'arrow',
      enabled: true,
      options: {
        element: options.arrowRef,
        padding: 8,
      },
    },
    {
      name: 'flip',
      enabled: true,
      options: {
        fallbackPlacements: ['bottom'],
        altBoundary: true,
        padding: 4,
        boundary: options.clippingBoundary,
      },
    },
    {
      name: 'preventOverflow',
      enabled: true,
      options: {
        altAxis: true,
        altBoundary: true,
        padding: 4,
        boundary: options.clippingBoundary,
      },
    },
  ];
}

export default function FirePopup({ isOpen, feature }: Props) {
  const anchorRef = React.useRef(null);
  const popperRef = React.useRef<HTMLDivElement>(null);
  const [arrowRef, setArrowRef] = React.useState<HTMLElement | null>(null);
  const [showPopup, setShowPopup] = React.useState(isOpen);
  const [popperPlacement, setPopperPlacement] =
    React.useState<PopperProps['placement']>('top');
  const tProjectDetails = useTranslations('ProjectDetails');

  useEffect(() => {
    if (popperRef.current?.getAttribute('data-popper-placement')) {
      setPopperPlacement(
        popperRef.current?.getAttribute(
          'data-popper-placement'
        ) as PopperProps['placement']
      );
    }
  }, [popperRef?.current?.getAttribute('data-popper-placement')]);

  const alertAge = useMemo(() => {
    const ms = Math.abs(
      new Date().getTime() - new Date(feature.properties.eventDate).getTime()
    );

    const hours = Math.round(ms / (1000 * 60 * 60));
    if (hours < 24) {
      return { amount: `${hours}`, unit: 'h' }; // Less than 24 hours
    }

    const days = Math.round(hours / 24); // Calculate days
    return { amount: `${days}`, unit: 'd' }; // 24 hours or more
  }, [feature.properties.eventDate]);

  const alertCoordinates = useMemo(() => {
    const [lng, lat] = feature.geometry.coordinates;
    const latString = lat >= 0 ? `${Math.abs(lat)}°N` : `${Math.abs(lat)}°S`;
    const lngString = lng >= 0 ? `${Math.abs(lng)}°E` : `${Math.abs(lng)}°W`;
    return `${latString}, ${lngString}`;
  }, [feature.geometry.coordinates]);

  const alertConfidence = useMemo(() => {
    const confidenceMap: Record<string, string> = {
      high: 'highAlertConfidenceText',
      medium: 'mediumAlertConfidenceText',
      low: 'lowAlertConfidenceText',
    };

    return (confidenceMap[feature.properties.confidence] ||
      'mediumAlertConfidenceText') as ConfidencesType;
  }, [feature.properties.confidence]);

  const firealertAppLink = useMemo(() => {
    const deviceType = getDeviceType();
    let link = 'https://www.plant-for-the-planet.org/firealert/';
    if (deviceType === 'android') {
      link = 'https://play.google.com/store/apps/details?id=eco.pp.firealert';
    } else if (deviceType === 'ios') {
      link = 'https://apps.apple.com/app/fire-alert-for-forests/id1667307676';
    }
    return link;
  }, []);

  return (
    <>
      <Popper
        id="fire-popup"
        open={showPopup}
        ref={popperRef}
        anchorEl={anchorRef.current}
        placement="top"
        className={styles.popperWrapper}
        disablePortal={false}
        onMouseLeave={() => setShowPopup(false)}
        onMouseEnter={() => setShowPopup(true)}
        modifiers={popperModifiers({
          arrowRef,
          clippingBoundary: document.querySelector('canvas.maplibregl-canvas'),
        })}
      >
        {popperPlacement === 'top' ? (
          <div className={`${styles.arrowTop}`} ref={setArrowRef} />
        ) : (
          <div className={`${styles.arrowBottom}`} ref={setArrowRef} />
        )}
        <aside className={styles.popupContainer}>
          <header className={styles.popupTitle}>
            <h2 className={styles.titleText}>
              <FirePopupIcon width={18} /> {tProjectDetails('forestFire')}
            </h2>
            <p className={styles.timeDuration}>
              {alertAge.unit === 'h'
                ? tProjectDetails('hoursAgo', {
                    age: alertAge.amount,
                  })
                : tProjectDetails('daysAgo', {
                    age: alertAge.amount,
                  })}
              <InfoIconPopup width={9} height={9} color={'#828282'}>
                <div className={styles.infoIconPopupContainer}>
                  {tProjectDetails('firePopupText')}
                </div>
              </InfoIconPopup>
            </p>
          </header>
          <div className={styles.popupText}>
            <p className={styles.coordinates}>{alertCoordinates}</p>
            <p>
              {tProjectDetails.rich(alertConfidence, {
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
        <FireIcon width={24} />
      </div>
    </>
  );
}
