import type { IconProps } from '../../../../../src/features/common/types/common';

import React from 'react';

function Delete({ color = '#2f3336' }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10.185"
      height="11.64"
      viewBox="0 0 10.185 11.64"
    >
      <path
        fill={color}
        d="M.727 10.548a1.091 1.091 0 001.092 1.092h6.547a1.091 1.091 0 001.091-1.091V2.91H.727zm6.184-5.82a.364.364 0 01.727 0v5.093a.364.364 0 11-.727 0zm-2.182 0a.364.364 0 01.727 0v5.093a.364.364 0 11-.727 0zm-2.182 0a.364.364 0 01.727 0v5.093a.364.364 0 11-.727 0zm7.275-4H7.093L6.879.3A.546.546 0 006.39 0h-2.6a.539.539 0 00-.487.3l-.211.427H.364A.364.364 0 000 1.091v.727a.364.364 0 00.364.364h9.457a.364.364 0 00.364-.364v-.727a.364.364 0 00-.364-.364z"
        data-name="Icon awesome-trash-alt"
      ></path>
    </svg>
  );
}

export default Delete;
