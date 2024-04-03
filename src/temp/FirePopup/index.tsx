import { Popper } from '@mui/material';
import React from 'react';
import styles from './FirePopup.module.scss';
import FireIcon from '../icons/FireIcon';
import FirePopupIcon from '../icons/FirePopupIcon';
import NewInfoIcon from '../icons/NewInfoIcon';

interface Props {
  isOpen: boolean;
}

export default function FirePopup({ isOpen }: Props) {
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
            <div className={styles.titleText}>
              <FirePopupIcon width={18} /> Forest Fire
            </div>
            <p className={styles.timeDuration}>
              21h ago <NewInfoIcon width={9} color={'#828282'} />
            </p>
          </div>
          <div className={styles.popupText}>
            <p className={styles.coordinates}>18.71122, -87.71138</p>
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
