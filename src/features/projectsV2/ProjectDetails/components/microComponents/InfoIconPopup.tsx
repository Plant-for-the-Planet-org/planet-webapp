import React from 'react';
import NewInfoIcon from '../../../../../../public/assets/images/icons/projectV2/NewInfoIcon';
import { bindHover, bindPopover } from 'material-ui-popup-state';
import HoverPopover from 'material-ui-popup-state/HoverPopover';
import { usePopupState } from 'material-ui-popup-state/hooks';

interface Props {
  height: number;
  width: number;
  color: string;
  children: React.ReactNode;
}

const InfoIconPopup = ({ height, width, color, children }: Props) => {
  const abandonmentInfoPopupState = usePopupState({
    variant: 'popover',
    popupId: 'abandonmentInfoPopover',
  });
  return (
    <div
      {...bindHover(abandonmentInfoPopupState)}
      style={{ cursor: 'pointer' }}
    >
      <NewInfoIcon height={height} width={width} color={color} />
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

export default InfoIconPopup;
