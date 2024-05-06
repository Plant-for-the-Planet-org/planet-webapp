import { useState, MouseEvent } from 'react';
import { Popover } from '@mui/material';
import myForestMapStyle from '../MyForestV2.module.scss';
import { InfoIcon } from '../../../../../../public/assets/images/ProfilePageIcons';

const MyForestMapCredit = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const handlePopoverOpen = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  return (
    <div className={myForestMapStyle.mapCreditsContainer}>
      <div onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
        <InfoIcon width={24} height={24} />
      </div>
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
