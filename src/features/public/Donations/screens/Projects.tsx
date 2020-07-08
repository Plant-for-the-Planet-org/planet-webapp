import React, { ReactElement } from 'react'
import styles from './../styles/Projects.module.css'
import SearchIcon from './../../../../assets/images/icons/SearchIcon'
import AllProjects from '../components/AllProjects'
import FeaturedProjects from '../components/FeaturedProjects'

interface Props {
    
}

function Projects({}: Props): ReactElement {
    const [selectedTab,setSelectedTab] = React.useState('featured')
    return (
        <div className={styles.container}>
            
            <div className={styles.header}>
                <div className={styles.tabButtonContainer}>
                    <div className={styles.tabButton} onClick={()=>setSelectedTab('featured')}>
                        <div className={selectedTab === 'featured' ? styles.tabButtonSelected : styles.tabButtonText}>Featured</div>
                        {selectedTab === 'featured' ? <div className={styles.tabButtonSelectedIndicator} /> : null}    
                    </div>

                    <div className={styles.tabButton} onClick={()=>setSelectedTab('all')}>
                    <div className={selectedTab === 'all' ? styles.tabButtonSelected : styles.tabButtonText}>All 112 Projects</div>
                        {selectedTab === 'all' ? <div className={styles.tabButtonSelectedIndicator} /> : null}
                    </div>
                </div>
                <div className={styles.searchIcon}>
                    <SearchIcon/>
                </div>
            </div>


            <div className={styles.projectsContainer}>
                {selectedTab === 'featured' ? <AllProjects/> :<FeaturedProjects/>}
            </div>

        </div>
    )
}

export default Projects
