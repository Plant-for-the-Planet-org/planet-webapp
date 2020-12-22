import React from 'react';

function SendIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.024 15.124">
      <path
        id="telegram"
        d="M9.78,18.65l.28-4.23L17.74,7.5c.34-.31-.07-.46-.52-.19L7.74,13.3,3.64,12c-.88-.25-.89-.86.2-1.3L19.81,4.54c.73-.33,1.43.18,1.15,1.3L18.24,18.65c-.19.91-.74,1.13-1.5.71L12.6,16.3l-1.99,1.93A1.059,1.059,0,0,1,9.78,18.65Z"
        transform="translate(-3 -4.441)"
        fill={props.color ? props.color : '#fff'}
      />
    </svg>
  );
}

export default SendIcon;
