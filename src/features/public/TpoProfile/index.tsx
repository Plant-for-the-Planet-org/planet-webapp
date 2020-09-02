import React, {useRef} from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import LandingSection from '../../common/Layout/LandingSection';
import TreeCounter from './../../common/TreeCounter/TreeCounter';
import styles from './TpoProfile.module.scss';
import TpoInfo from './components/TpoInfo'
import Footer from '../../common/Footer';
import ProjectsContainer from './components/ProjectsContainer'

export default function TpoProfile({ tpoprofile }: any) {

  return (

    <main>
      {/* tpoinfo section */}
      <div className={styles.wrappingDiv}>
      <LandingSection fixedBg>
          <div className={styles.tpoProfileDiv}>
          <TpoInfo 
          tpoprofile={tpoprofile} 
          />
          </div>

           {/*  projects section */}
           <div className={styles.projectsContainer}>
            <ProjectsContainer projects={tpoprofile.userProfile.plantProjects} />
          </div>
  
        {/* footer */}
        <div className={styles.footerDiv}>
          <Footer />
        </div>

        </LandingSection>
        </div>

       
    </main>
  );
}
