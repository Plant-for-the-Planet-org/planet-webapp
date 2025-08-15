import type { MouseEvent } from 'react';

import { useState } from 'react';
import { Typography, Popover } from '@mui/material';
import styles from './MapCredit.module.scss';
import InfoIconTransparent from '../../../../../../../../../public/assets/images/icons/InfoIconTransparent';

const MapCredit = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handlePopoverOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  return (
    <div className={styles.mapCreditsContainer}>
      <Typography
        aria-owns={open ? 'mouse-over-popover' : undefined}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <InfoIconTransparent width={24} height={24} />
      </Typography>
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <div className={styles.mapCredit}>
          Esri Community Maps Contributors, Esri, HERE, Garmin, METI/NASA, USGS,
          Maxar, Earthstar Geographics, CNES/Airbus DS, USDA FSA, Aerogrid, IGN,
          IGP, and the GIS User Community
        </div>
      </Popover>
    </div>
  );
};

export default MapCredit;
