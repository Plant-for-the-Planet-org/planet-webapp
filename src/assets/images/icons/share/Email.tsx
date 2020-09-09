import React from "react";

function Icon(props:any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{border: 'none'}}
      enableBackground="new 0 0 477.867 477.867"
      version="1.1"
      viewBox="0 0 477.867 477.867"
      xmlSpace="preserve"
      width="65%"
      height="65%"
    >
      <path 
      fill={props.color ? props.color: "black"}
      d="M460.8 68.267H17.067l221.867 182.75L463.309 68.779c-.821-.24-1.66-.411-2.509-.512z"></path>
      <path
      fill={props.color ? props.color: "black"}
       d="M249.702 286.31a17.065 17.065 0 01-21.623 0L0 98.406v294.127c0 9.426 7.641 17.067 17.067 17.067H460.8c9.426 0 17.067-7.641 17.067-17.067V100.932L249.702 286.31z"></path>
    </svg>
  );
}

export default Icon;