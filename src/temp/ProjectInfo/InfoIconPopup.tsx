import React from 'react';
import NewInfoIcon from '../icons/NewInfoIcon';
import { bindHover, bindPopover } from 'material-ui-popup-state';
import HoverPopover from 'material-ui-popup-state/HoverPopover';
import { usePopupState } from 'material-ui-popup-state/hooks';
import styles from './ProjectInfo.module.scss';

interface Props {
  height: number;
  width: number;
  color: string;
  text: string;
}

const InfoIconPopup = ({ height, width, color, text }: Props) => {
  const abandonmentInfoPopupState = usePopupState({
    variant: 'popover',
    popupId: 'abandonmentInfoPopover',
  });
  return (
    <div {...bindHover(abandonmentInfoPopupState)}>
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
        <div className={styles.infoIconPopupContainer}>{text}</div>
      </HoverPopover>
    </div>
  );
};

export default InfoIconPopup;
