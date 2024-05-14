import { useState, MouseEvent } from 'react';
import { Popover } from '@mui/material';
import InfoIcon from '../../../../../../public/assets/images/icons/myForestV2Icons/statsIcon/InfoIcon';
import style from '../Common/common.module.scss';

const DonationStatInfo = () => {
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
    <div className={style.donationstatInfoContainer}>
      <div onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
        <InfoIcon width={10} />
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
        <div className={style.donationStatPopup}>
          Total donation volume of your donations. This is only visible to you,
          even if your profile is set to public.
        </div>
      </Popover>
    </div>
  );
};

export default DonationStatInfo;
