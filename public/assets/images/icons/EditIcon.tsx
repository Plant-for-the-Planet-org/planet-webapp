import type { ReactElement } from 'react';
import type { IconProps } from '../../../../src/features/common/types/common';

import themeProperties from '../../../../src/theme/themeProperties';

export default function EditIcon({
  color = themeProperties.designSystem.colors.coreText,
  width = '16px',
}: IconProps): ReactElement {
  return (
    <svg
      width={width}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.359528 17.6415L-7.87765e-06 22.5621C-0.0579976 23.3777 0.618549 24.0541 1.43427 23.9961L6.35179 23.6405L20.5399 9.45851L14.5399 3.45947L0.359528 17.6415Z"
        fill={color}
      />
      <path
        d="M22.759 1.24081C21.1005 -0.417428 18.4175 -0.417428 16.759 1.24081L15.5799 2.41974L21.5799 8.41878L22.759 7.23984C24.4175 5.5816 24.4175 2.89905 22.759 1.24081Z"
        fill={color}
      />
    </svg>
  );
}
