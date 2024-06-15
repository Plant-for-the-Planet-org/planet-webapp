//to be removed
import { bindHover, bindPopover } from 'material-ui-popup-state';
import HoverPopover from 'material-ui-popup-state/HoverPopover';
import { usePopupState } from 'material-ui-popup-state/hooks';
import React from 'react';
import { ProfileInfoIcon } from '../../../../../public/assets/images/icons/ProfilePageV2Icons';

interface Props {
  height: number;
  width: number;
  color: string;
  children: React.ReactNode;
}

const CustomTooltip = ({ height, width, color, children }: Props) => {
  const abandonmentInfoPopupState = usePopupState({
    variant: 'popover',
    popupId: 'abandonmentInfoPopover',
  });
  return (
    <div
      {...bindHover(abandonmentInfoPopupState)}
      style={{ cursor: 'pointer' }}
    >
      <ProfileInfoIcon height={height} width={width} color={color} />
      <HoverPopover
        {...bindPopover(abandonmentInfoPopupState)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {children}
      </HoverPopover>
    </div>
  );
};

export default CustomTooltip;
