import React from 'react';
import Stories from 'react-insta-stories';

export default function ImageSlider(project: any) {

  return <Stories
    stories={
      project
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