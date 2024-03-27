import { Popper } from '@mui/material';
import React from 'react';
import styles from './FirePopup.module.scss';
import FireIcon from '../icons/FireIcon';
import FirePopupIcon from '../icons/FirePopupIcon';

interface Props {
  isOpen: boolean;
}

export default function Popup({ isOpen }: Props) {
  const anchorRef = React.useRef(null);
  const [arrowRef, setArrowRef] = React.useState(null);
  const [showPopup, setShowPopup] = React.useState(isOpen);

  return (
    <>
      <Popper
        id="fire-popup"
        open={showPopup}
        anchorEl={anchorRef.current}
        placement="top"
        disablePortal={false}
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
            <FirePopupIcon /> Forest Fire
          </div>
          <div className={styles.popupText}>
            <p>18.71122, -87.71138</p>
            <p className={styles.timeDuration}>21h ago</p>
            <p>
              <span>High</span> alert confidence
            </p>
            <p className={styles.setUpText}>
              Set up alerts with <span>FireAlert</span>
            </p>
          </div>
        </div>
      </Popper>
      <div
        ref={anchorRef}
        onMouseEnter={() => setShowPopup(true)}
        onMouseLeave={() => setShowPopup(false)}
        className={styles.fireIcon}
      >
        <FireIcon />
      </div>
    </>
  );
}
