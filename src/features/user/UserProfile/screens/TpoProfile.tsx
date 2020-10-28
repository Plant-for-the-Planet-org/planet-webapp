import React from 'react';
import LandingSection from '../../../common/Layout/LandingSection';
import ProjectsContainer from '../components/ProjectsContainer';
import PublicUserInfo from '../components/PublicUserInfo';

export default function TpoProfile({ userprofile }: any) {
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
      {/* <ProjectsContainer
        projects={userprofile.userProfile.plantProjects}
      /> */}
    </>
  );
}
