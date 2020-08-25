import React from 'react';
import Stories from 'react-insta-stories';

export default function ImageSlider(props) {
  return (
    <Stories
      stories={props}
      defaultInterval={7000}
      width={325}
      height={244}
      loop={true}
    />
  );
}
