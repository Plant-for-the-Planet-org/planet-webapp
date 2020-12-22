import React from 'react';

function DownloadIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
      <path
        id="Path_3016"
        data-name="Path 3016"
        d="M19,13v5a1,1,0,0,1-1,1H6a1,1,0,0,1-1-1V13a1,1,0,0,0-2,0v6a2.006,2.006,0,0,0,2,2H19a2.006,2.006,0,0,0,2-2V13a1,1,0,0,0-2,0Zm-6-.33,1.88-1.88a1,1,0,1,1,1.41,1.41L12.7,15.79a1,1,0,0,1-1.41,0L7.7,12.2a1,1,0,0,1,1.41-1.41L11,12.67V4a1,1,0,0,1,2,0Z"
        transform="translate(-3 -3)"
        fill={props.color ? props.color : '#68B030'}
      />
    </svg>
  );
}

export default DownloadIcon;
