import React from "react";

function Map(props:any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <g data-name="Group 1985" transform="translate(-31 -231.333)">
        <path
          fill="none"
          d="M0 0H24V24H0z"
          data-name="Rectangle 973"
          transform="translate(31 231.333)"
        ></path>
        <path
          fill={props.color}
          d="M0 5.819v14.43a.667.667 0 00.914.619l5.753-2.618v-16L.838 4.581A1.334 1.334 0 000 5.819zM8 18.25l8 2.667v-16L8 2.25zM23.086 2.3l-5.753 2.617v16l5.828-2.331A1.333 1.333 0 0024 17.347V2.918a.667.667 0 00-.914-.618z"
          data-name="Icon awesome-map"
          transform="translate(31 231.75)"
        ></path>
      </g>
    </svg>
  );
}

export default Map;
