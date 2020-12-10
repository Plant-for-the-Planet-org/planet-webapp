import React from 'react';

function TreeIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="19.25"
      viewBox="0 0 19 19.25"
    >
      <g
        id="Group_3102"
        data-name="Group 3102"
        transform="translate(-16 -2.75)"
      >
        <path
          id="tree_1_"
          data-name="tree (1)"
          d="M11,21V16.74A4.379,4.379,0,0,1,9.5,17,4.481,4.481,0,0,1,5,12.5,4.413,4.413,0,0,1,6.36,9.27,4.505,4.505,0,0,1,14.25,5h.25A5.5,5.5,0,1,1,13,15.79V21Z"
          transform="translate(13)"
          fill={props.color ? props.color : '#68B030'}
          stroke="#fff"
          stroke-width="0.5"
        />
        <ellipse
          id="Ellipse_182"
          data-name="Ellipse 182"
          cx="9.5"
          cy="1"
          rx="9.5"
          ry="1"
          transform="translate(16 20)"
          fill={props.color ? props.color : '#68B030'}
        />
      </g>
    </svg>
  );
}

export default TreeIcon;
