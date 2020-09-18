import React from 'react';
import LandingSection from '../../common/Layout/LandingSection';
import ProjectsContainer from './components/ProjectsContainer';
import PublicUserInfo from './components/PublicUserInfo';

export default function PublicUserProfile({ publicUserprofile }: any) {
  return (
    <>
      <LandingSection
        imageSrc={
          process.env.CDN_URL
            ? `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`
            : `https://cdn.plant-for-the-planet.org/media/images/app/bg_layer.jpg`
        }
      >
        <PublicUserInfo publicUserprofile={publicUserprofile} />
      </LandingSection>
      <ProjectsContainer
        projects={publicUserprofile.userProfile.plantProjects}
      />
    </>
  );
}
