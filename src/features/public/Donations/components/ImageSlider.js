import React from 'react';
import Stories from 'react-insta-stories';

export default function ImageSlider(props) {
  const [slider, setSlider] = React.useState();
  React.useEffect(() => {
    setSlider(
      <Stories
        stories={props.project}
        defaultInterval={7000}
        width="100%"
        height={220}
        loop={true}
      />
    );
  }, []);
  return <>{slider}</>;
}
