import { ReactElement, ReactNode } from 'react';
import { bindHover, bindPopover } from 'material-ui-popup-state';
import HoverPopover from 'material-ui-popup-state/HoverPopover';
import { usePopupState } from 'material-ui-popup-state/hooks';

interface Props {
  badgeContent: ReactElement;
  children: ReactNode;
  shouldDisplayPopup: boolean | undefined;
}

const CustomTooltip = ({
  children,
  badgeContent,
  shouldDisplayPopup,
}: Props) => {
  const abandonmentInfoPopupState = usePopupState({
    variant: 'popover',
    popupId: 'abandonmentInfoPopover',
  });
  return (
    <div {...bindHover(abandonmentInfoPopupState)}>
      {badgeContent}
      {shouldDisplayPopup && (
        <HoverPopover
          {...bindPopover(abandonmentInfoPopupState)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
          sx={{
            '.MuiPopover-paper': {
              borderRadius: '12px',
            },
          }}
        >
          {children}
        </HoverPopover>
      )}
    </div>
  );
};

export default CustomTooltip;
