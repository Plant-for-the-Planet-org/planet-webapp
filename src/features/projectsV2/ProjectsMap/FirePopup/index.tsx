import type { SetStateAction } from 'react';
import type { FireFeature } from '../../../common/types/fireLocation';
import type { PopperProps } from '@mui/material';
import type { Modifier } from '@popperjs/core';

import { useState, useRef } from 'react';
import { Popper } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';
import RightArrowIcon from '../../../../../public/assets/images/icons/projectV2/RightArrowIcon';
import InfoIconPopup from '../../ProjectDetails/components/microComponents/InfoIconPopup';
import FirePopupIcon from '../../../../../public/assets/images/icons/FirePopupIcon';
import styles from './FirePopup.module.scss';
import { getDeviceType } from '../../../../utils/projectV2';
import themeProperties from '../../../../theme/themeProperties';

interface Props {
  isOpen: boolean;
  feature: FireFeature;
  anchorEl: HTMLElement | null;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}
type ConfidencesType =
  | 'highAlertConfidenceText'
  | 'mediumAlertConfidenceText'
  | 'lowAlertConfidenceText';

const { colors } = themeProperties.designSystem;
type PopperModifier = Modifier<string, Record<string, unknown>>;
function popperModifiers(options: {
  arrowRef: SetStateAction<HTMLElement | null>;
  clippingBoundary: HTMLElement | null;
}): Partial<PopperModifier>[] | undefined {
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

export default function FirePopup({
  isOpen,
  feature,
  anchorEl,
  onMouseEnter,
  onMouseLeave,
}: Props) {
  const popperRef = useRef<HTMLDivElement>(null);
  const [arrowRef, setArrowRef] = useState<HTMLElement | null>(null);
  const [showPopup, setShowPopup] = useState(isOpen);
  const [popperPlacement, setPopperPlacement] =
    useState<PopperProps['placement']>('top');
  const tProjectDetails = useTranslations('ProjectDetails');

  useEffect(() => {
    setShowPopup(isOpen);
  }, [isOpen]);

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
        anchorEl={anchorEl}
        placement="top"
        disablePortal={false}
        onMouseLeave={() => {
          onMouseLeave?.();
          setShowPopup(false);
        }}
        onMouseEnter={() => {
          onMouseEnter?.();
          setShowPopup(true);
        }}
        modifiers={popperModifiers({
          arrowRef,
          clippingBoundary: document.querySelector('canvas.maplibregl-canvas'),
        })}
      >
        {popperPlacement === 'top' ? (
          <div className={styles.arrowTop} ref={setArrowRef} />
        ) : (
          <div className={styles.arrowBottomContainer} ref={setArrowRef}>
            <div className={styles.arrowBottomWhite} />
            <div className={styles.arrowBottomColored} />
          </div>
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
              <InfoIconPopup width={9} height={9} color={colors.softText2}>
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
              <RightArrowIcon width={5} color={colors.softText} />
            </a>
          </div>
        </aside>
      </Popper>
    </>
  );
}
