import { ReactElement, ReactNode } from 'react';
import { bindHover, bindPopover } from 'material-ui-popup-state';
import HoverPopover from 'material-ui-popup-state/HoverPopover';
import { usePopupState } from 'material-ui-popup-state/hooks';

interface Props {
  triggerElement: ReactElement;
  children: ReactNode;
  showPopup: boolean | undefined;
}

const CustomTooltip = ({ children, triggerElement, showPopup }: Props) => {
  const popupState = usePopupState({
    variant: 'popover',
    popupId: null,
  });

  return (
    <>
      <div {...bindHover(popupState)}>
        {triggerElement}
        {showPopup && (
          <HoverPopover
            {...bindPopover(popupState)}
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'center',
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
    </>
  );
};

export default CustomTooltip;
