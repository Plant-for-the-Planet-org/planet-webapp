import type { ReactElement } from 'react';
import type { IconProps } from '../../../../src/features/common/types/common';

function FileProcessingIcon({ color = '#2f3336' }: IconProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9C10.34 9 9 10.34 9 12Z"
        fill={color}
        fillOpacity="0.54"
      />
      <path
        d="M8 9C8 8.45 7.55 8 7 8H5.09C6.47 5.61 9.05 4 12 4C15.49 4 18.45 6.24 19.54 9.36C19.68 9.75 20.07 10 20.48 10C21.16 10 21.66 9.33 21.44 8.69C20.07 4.79 16.36 2 12 2C8.73 2 5.82 3.58 4 6.01V5C4 4.45 3.55 4 3 4C2.45 4 2 4.45 2 5V9C2 9.55 2.45 10 3 10H7C7.55 10 8 9.55 8 9Z"
        fill={color}
        fillOpacity="0.54"
      />
      <path
        d="M16.0003 15C16.0003 15.55 16.4503 16 17.0003 16H18.9103C17.5303 18.39 14.9503 20 12.0003 20C8.51034 20 5.55034 17.76 4.46034 14.64C4.32034 14.25 3.93034 14 3.52034 14C2.84034 14 2.34034 14.67 2.56034 15.31C3.93034 19.21 7.64034 22 12.0003 22C15.2703 22 18.1803 20.42 20.0003 17.99V19C20.0003 19.55 20.4503 20 21.0003 20C21.5503 20 22.0003 19.55 22.0003 19V15C22.0003 14.45 21.5503 14 21.0003 14H17.0003C16.4503 14 16.0003 14.45 16.0003 15Z"
        fill={color}
        fillOpacity="0.54"
      />
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        dur="5s"
        from="0 0 0"
        to="360 0 0"
        repeatCount="indefinite"
      />
    </svg>
  );
}

export default FileProcessingIcon;
