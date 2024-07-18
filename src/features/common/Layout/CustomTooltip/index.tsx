import React from 'react';
import { bindHover, bindPopover } from 'material-ui-popup-state';
import HoverPopover from 'material-ui-popup-state/HoverPopover';
import { usePopupState } from 'material-ui-popup-state/hooks';
import { IconProps } from '../../types/common';

interface Props {
  height: number;
  width: number;
  color: string;
  children: React.ReactNode;
}

const NewInfoIcon = ({ height, width, color }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 14 15"
      fill="none"
    >
      <path
        d="M7 0.5C3.13444 0.5 0 3.63444 0 7.5C0 11.3656 3.13444 14.5 7 14.5C10.8656 14.5 14 11.3656 14 7.5C14 3.63444 10.8656 0.5 7 0.5ZM8.23978 10.4384L8.15422 10.7247C8.14022 10.7744 8.11067 10.818 8.07022 10.8507C7.588 11.2209 6.97044 11.3656 6.37467 11.2489L6.37933 11.2427C6.36378 11.2396 6.34822 11.238 6.33267 11.2333C5.81933 11.1058 5.50667 10.5878 5.63422 10.0744L6.3 7.39422C6.45867 6.75178 5.754 6.90422 5.46311 6.99289C5.42733 7.00378 5.39 6.98356 5.37911 6.94778C5.376 6.93533 5.376 6.92133 5.37911 6.90889L5.46467 6.62267C5.47867 6.57289 5.50822 6.52933 5.54867 6.49667C6.03089 6.12644 6.64844 5.98178 7.24422 6.09844C7.24422 6.09844 7.28156 6.10467 7.30022 6.10933C7.81356 6.23689 8.12622 6.75489 7.99867 7.26822L7.29867 10.0869C7.26756 10.5722 7.88667 10.4369 8.15733 10.3544C8.19311 10.3436 8.23044 10.3638 8.24133 10.3996C8.24444 10.412 8.24444 10.426 8.24133 10.4384H8.23978ZM7.62378 5.71422C7.07156 5.71422 6.62356 5.26622 6.62356 4.714C6.62356 4.16178 7.07156 3.71378 7.62378 3.71378C8.176 3.71378 8.624 4.16178 8.624 4.714C8.624 5.26622 8.176 5.71422 7.62378 5.71422Z"
        fill={color}
      />
    </svg>
  );
};

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

export default CustomTooltip;
