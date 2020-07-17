import React from "react";

function Me(props:any) {
  const source = props.src;
  if (props.src) {
    return (<img width="24" height="24" src={props.src}/>);
  } else {
    return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <circle
        cx="12"
        cy="12"
        r="12"
        fill={props.color}
        data-name="Ellipse 120"
      ></circle>
    </svg>
    );
  }
}

export default Me;
