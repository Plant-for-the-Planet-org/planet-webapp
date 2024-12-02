import type { MouseEvent } from 'react';

import { useState } from 'react';
import { Popover } from '@mui/material';
import styles from './common.module.scss';
import { InfoIcon } from '../../../../../../public/assets/images/ProfilePageIcons';

const MapCredits = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handlePopoverOpen = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
    setIsPopoverOpen(true);
  };
  const handlePopoverClose = () => {
    setTimeout(() => {
      setAnchorEl(null);
      setIsPopoverOpen(false);
    }, 300);
  };

  return (
    <div className={styles.mapCreditsContainer}>
      <div
        className={styles.mapCreditsTooltip}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <InfoIcon height={25} />
      </div>
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
        }}
        open={isPopoverOpen}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <div className={styles.mapCreditsContent}>
          Esri Community Maps Contributors, Esri, HERE, Garmin, METI/NASA, USGS,
          Maxar, Earthstar Geographics, CNES/Airbus DS, USDA FSA, Aerogrid, IGN,
          IGP, and the GIS User Community
        </div>
      </Popover>
    </div>
  );
};

export default MapCredits;
