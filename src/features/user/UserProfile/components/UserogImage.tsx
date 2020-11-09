import React from 'react';
import * as htmlToImage from 'html-to-image';
import { getS3Image, mapboxImage } from '../../../../utils/getImageURL';

export default function UserOgImage({ userprofile }: any) {
  const [imageurl, setImageUrl] = React.useState(null);

  React.useEffect(() => {
    mapboxImage().then((data) => {
      setImageUrl(data);
    });
  }, []);

  const convertComponentToImage = () => {
    const node = document.getElementById('ogImage');
    console.log(node);
    htmlToImage.toBlob(node).then((blob) => {
        const url = URL.createObjectURL(blob)
      console.log(url);
    //   window.saveAs(blob, 'my-node.png');
      localStorage.setItem('image', url);
    });
  };
  return (
      <div id="ogImage">
        <div style={{ position: 'relative' }}>
            <img src={imageurl} height="300px" width="100%" />
            <div style={{ position: 'absolute', top: '20px', right: '25px' }}>
                <img src={getS3Image('profile', 'avatar', userprofile.image)} height="30px" width="30px" style={{ borderRadius: '40px' }} alt="no pic" />
            </div>
        </div>
        <div style={plantedTrees}>
            <p style={plantedTreesTxt}>200 trees planted</p>
        </div>
        {convertComponentToImage()}
      </div>
  );
}

const plantedTrees = {
  backgroundColor: '#79B806',
  color: 'white',
  marginTop: '-5px',
  width: '60%',
  height: '30px',
  borderRadius: '0px 15px 15px 0px',
};

const plantedTreesTxt = {
  paddingLeft: '7px',
  paddingTop: '4px',
};
