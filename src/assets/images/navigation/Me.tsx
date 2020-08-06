import React from 'react';

function Me(props: any) {
  const source = props.src;
  if (props.src) {
    return <img width="24" height="24" src={props.src} />;
  } else {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <g
          id="Group_2671"
          data-name="Group 2671"
          transform="translate(-1153 1)"
        >
          <circle
            id="Ellipse_120"
            data-name="Ellipse 120"
            cx="12"
            cy="12"
            r="12"
            transform="translate(1153 -1)"
            fill={props.color ? props.color : '#2f3336'}
          />
          <path
            id="Icon_awesome-user"
            data-name="Icon awesome-user"
            d="M7,8A4,4,0,1,0,3,4,4,4,0,0,0,7,8ZM9.8,9H9.278A5.44,5.44,0,0,1,4.722,9H4.2A4.2,4.2,0,0,0,0,13.2v1.3A1.5,1.5,0,0,0,1.5,16h11A1.5,1.5,0,0,0,14,14.5V13.2A4.2,4.2,0,0,0,9.8,9Z"
            transform="translate(1157.55 3)"
            fill="#fff"
          />
        </g>
      </svg>
    );
  }
}

export default Me;
