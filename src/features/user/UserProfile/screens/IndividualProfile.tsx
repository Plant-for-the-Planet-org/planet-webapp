import React from 'react';
import LandingSection from '../../../common/Layout/LandingSection';
import PublicUserInfo from '../components/PublicUserInfo';

export default function IndividualProfile({ userprofile }: any) {
  return (
    <>
      <LandingSection
        imageSrc={
          process.env.CDN_URL
            ? `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`
            : `https://cdn.plant-for-the-planet.org/media/images/app/bg_layer.jpg`
        }
      >
        <PublicUserInfo userprofile={userprofile} />
      </LandingSection>
    </>
  );
}
