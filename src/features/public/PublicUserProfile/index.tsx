import React from 'react';
import Footer from '../../common/Footer';
import LandingSection from '../../common/Layout/LandingSection';
import ProjectsContainer from './components/ProjectsContainer';
import PublicUserInfo from './components/PublicUserInfo';
import styles from './PublicUserProfile.module.scss';

export default function PublicUserProfile({ publicUserprofile }: any) {
  return (
    <div>
      {/* publicUserinfo section */}

      <LandingSection
        fixedBg
        noFixedHeight
        imageSrc={
          process.env.CDN_URL
            ? `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`
            : `https://cdn.plant-for-the-planet.org/media/images/app/bg_layer.jpg`
        }
      >
        <div className={styles.publicUserProfileDiv}>
          <PublicUserInfo publicUserprofile={publicUserprofile} />
        </div>

        {/* footer */}
      </LandingSection>
      {/*  projects section */}
      <div className={styles.projectsContainer}>
        <ProjectsContainer
          projects={publicUserprofile.userProfile.plantProjects}
        />
      </div>
      <Footer />
    </div>
  );
}
