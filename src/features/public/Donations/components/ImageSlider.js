import React from 'react';
import Stories from 'react-insta-stories';

export default function ImageSlider(props) {

  return <Stories
    stories={
      props.project
    }
    defaultInterval={
      7000
    }
    height={
      244
    }
    loop={
      true
    }
  />;
}