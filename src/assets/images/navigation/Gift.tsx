import React from "react";

function Gift(props:any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <g data-name="Group 1993" transform="translate(-17 -347.5)">
        <circle
          cx="12"
          cy="12"
          r="12"
          fill="none"
          data-name="Ellipse 124"
          transform="translate(17 347.5)"
        ></circle>
        <path
          fill={props.color ? props.color : '#2f3336'}
          d="M1.5 21.75a1.5 1.5 0 001.5 1.5h7.5v-7.5h-9zm12 1.5H21a1.5 1.5 0 001.5-1.5v-6h-9zm9-15h-1.973A4.087 4.087 0 0021 6.375a4.131 4.131 0 00-4.125-4.125c-1.95 0-3.211 1-4.828 3.2-1.617-2.2-2.878-3.2-4.828-3.2a4.131 4.131 0 00-4.125 4.125 4.03 4.03 0 00.473 1.875H1.5A1.5 1.5 0 000 9.75v3.75a.752.752 0 00.75.75h22.5a.752.752 0 00.75-.75V9.75a1.5 1.5 0 00-1.5-1.5zm-15.286 0a1.875 1.875 0 010-3.75c.933 0 1.622.155 4.036 3.75H7.214zm9.661 0h-4.036c2.409-3.586 3.08-3.75 4.036-3.75a1.875 1.875 0 010 3.75z"
          data-name="Icon awesome-gift"
          transform="translate(17 346.75)"
        ></path>
      </g>
    </svg>
  );
}

export default Gift;
