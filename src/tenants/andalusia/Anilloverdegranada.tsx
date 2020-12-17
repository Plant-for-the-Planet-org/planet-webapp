import React, { ReactElement } from 'react'
import Footer from '../../features/common/Layout/Footer'
import FeaturesSection from './components/FeaturesSection'
import LandingSection from './components/LandingSection'
import Objective from './components/Objective'
import ProjectBy from './components/ProjectBy'
import ProjectMap from './components/ProjectMap'
import SustainableCity from './components/SustainableCity'
import styles from './styles/anilloverdegranada.module.scss'

interface Props {

}

function Anilloverdegranada({ }: Props): ReactElement {
    const projectID = 'proj_0CgTQJMm5zX624sdpVDet93O';
    return (
        <div className={styles.pageContainer}>
            <LandingSection />
            <Objective />
            <FeaturesSection/>
            <ProjectMap projectID={projectID} />
            <SustainableCity/>
            <ProjectBy/>
            
            <Footer/>
        </div>
    )
}


export default Anilloverdegranada
