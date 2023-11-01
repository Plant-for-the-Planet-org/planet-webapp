import { useState, MouseEvent } from 'react';
import { Typography, Popover } from '@mui/material';
import myForestMapStyle from '../../styles/MyForestMap.module.scss';

const MyForestMapCredit = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handlePopoverOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  return (
    <div className={myForestMapStyle.mapCreditsContainer}>
      <Typography
        aria-owns={open ? 'mouse-over-popover' : undefined}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        Map Credits
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
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <div className={myForestMapStyle.mapCredit}>
          Esri Community Maps Contributors, Esri, HERE, Garmin, METI/NASA, USGS,
          Maxar, Earthstar Geographics, CNES/Airbus DS, USDA FSA, Aerogrid, IGN,
          IGP, and the GIS User Community
        </div>
      </Popover>
    </div>
  );
};

export default MyForestMapCredit;
