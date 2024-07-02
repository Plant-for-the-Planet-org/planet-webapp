import React from 'react';
import CustomControlledCarousel from '../../../../common/CustomControlledCarousel';
import sdgElements from './SDGCardsData';

const SDGCardList = () => {
  return (
    <CustomControlledCarousel
      carouselData={sdgElements}
      carouselTitle={
        'Restoring Ecosystems & Fighting the Climate Crisis for the SDGs'
      }
    />
  );
};

export default SDGCardList;
