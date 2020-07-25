import React, { ReactElement } from 'react'
import styles from './../styles/ProjectDetails.module.scss'
import MaterialRatings from '../../../common/InputTypes/Ratings';

import BlackTree from '../../../../assets/images/icons/project/BlackTree';
import Location from '../../../../assets/images/icons/project/Location';
import WorldWeb from '../../../../assets/images/icons/project/WorldWeb';
import Email from '../../../../assets/images/icons/project/Email';
import ProjectContactDetails from '../components/projectDetails/ProjectContactDetails';

import Sugar from 'sugar'
import { getImageUrl } from '../../../../utils/getImageURL'

import LazyLoad from 'react-lazyload';

interface Props {
    project:any
}

function ProjectDetails({project}: Props): ReactElement {
    const [rating, setRating] = React.useState<number | null>(2);

    const progressPercentage = (project.countPlanted / project.countTarget)*100+'%';
    const ImageSource = project.image ? getImageUrl('project', 'large',project.image) : '';
    const contactDetails = [
        {id:1,icon:<BlackTree/>,text:'View Profile',link:''},
        {id:2,icon:<WorldWeb/>,text:'edenprojects.org',link:''},
        {id:3,icon:<Location/>,text:'303 W Foothill Blvd, Unit 13 Glendora, CA 91741, USA',link:''},
        {id:4,icon:<Email/>,text:'projects@edenprojects.org',link:''},
    ]

    const loadImageSource = (image:any)=>{
        const ImageSource = getImageUrl('project', 'large',image);
        return ImageSource;
    }
    return (
        <div className={styles.container}>
        
        <div className={styles.projectContainer}>
            <div className={styles.singleProject}>

                    <div className={styles.projectImage}>
                        {project.image ?
                        <LazyLoad>
                            <div className={styles.projectImageFile} style={{backgroundImage:`linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.2), rgba(0,0,0,0), rgba(0,0,0,0)),url(${ImageSource})`}}></div>
                        </LazyLoad>
                        : null }
                        {project.classification ? 
                            <div className={styles.projectType}>
                                {project.classification}
                            </div>:null
                        }
                        <div className={styles.projectName}>
                            {Sugar.String.truncate(project.name,34)}
                        </div>
                    </div>
                    <div className={styles.progressBar}>
                        <div className={styles.progressBarHighlight} style={{width:progressPercentage}} />
                    </div>
                    
                    <div className={styles.projectCompleteInfo}>

                        <div className={styles.projectInfo}>
                            <div className={styles.projectData}>
                                <div className={styles.targetLocation}>
                                    <div className={styles.target}>
                                        {Sugar.Number.abbr(Number(project.countPlanted), 1)} planted •
                                    </div>
                                    <div className={styles.location}>
                                        {project.location}
                                    </div>   
                                </div>
                                {/* <div className={styles.projectTPOName}>
                                    By Global Forest Generation
                                </div> */}
                            </div>
                            <div className={styles.projectCost}>
                                <div className={styles.costButton}>
                                    {project.currency === 'USD' ? '$' : project.currency === 'EUR' ? '€' : project.currency} {project.treeCost.toFixed(2)}
                                </div>
                                <div className={styles.perTree}>
                                    per tree
                                </div>
                            </div>
                        </div>


                        <div className={styles.ratings}>
                            <div className={styles.calculatedRating}>
                                {rating}
                            </div>
                            <div className={styles.ratingButton}>
                                <MaterialRatings
                                    name="simple-controlled"
                                    value={rating}
                                    size="small"
                                    readOnly
                                    />
                            </div>
                        </div>

                        <div className={styles.projectDescription}>
                            {project.description}
                        </div>
                        
                        <div className={styles.projectInfoProperties}>
                            <LazyLoad>
                                <div className={styles.projectImageSliderContainer}>
                                {project.images ? project.images.map((image: { image: React.ReactNode; id: any; description:any })=>{
                                    return(
                                            <img className={styles.projectImages} key={image.id} src={loadImageSource(image.image)} alt={image.description} />   
                                    )
                                }) : null}
                                </div>
                            </LazyLoad>
                            {/* {infoProperties ? <ProjectInfo infoProperties={infoProperties} /> : null}
                            {financialReports? <FinancialReports financialReports={financialReports} /> : null}
                            {species ? <PlantSpecies species={species} /> : null }
                            {co2 ? (<CarbonCaptured co2={co2} />) : null} */}
                            
                            {contactDetails?(<ProjectContactDetails contactDetails={contactDetails} />) :null}

                        </div>
                        

                    </div>
                    
                </div>
        </div>
        </div>
        
    )
}

export default ProjectDetails

// Sample Code for future - 


// import Plane from '../../../../assets/images/icons/project/Plane';
// import Car from '../../../../assets/images/icons/project/Car';
// import RubberDuck from '../../../../assets/images/icons/project/RubberDuck';
// import CarbonCaptured from '../components/projectDetails/CarbonCaptured';
// import PlantSpecies from './../components/projectDetails/PlantSpecies'
// import FinancialReports from './../components/projectDetails/FinancialReports'
// import ProjectInfo from '../components/projectDetails/ProjectInfo';

// const infoProperties = [
//     {id:1,title:'Degradation',value:'Approx. 1990'},
//     {id:2,title:'First tree planted',value:'2013'},
//     {id:3,title:'Planting Density',value:'500 per ha'},
//     {id:4,title:'Survival rate',value:'63 %'},
//     {id:5,title:'Employee count',value:'53'},
//     {id:6,title:'Planting season',value:'June–October'}
// ]

// const financialReports = [
//     {id:1,year:2020,cost:'€ 1.25M',linkReport:''},
//     {id:2,year:2019,cost:'€ 1.25M',linkReport:''},
//     {id:3,year:2018,cost:'€ 1.25M',linkReport:''},
//     {id:4,year:2017,cost:'€ 1.25M',linkReport:''}
// ]

// const species = [
//     {id:1,percentage:'35%',speciesName:'Tabebuia rosea'},
//     {id:2,percentage:'12%',speciesName:'Swietenia humilis'},
//     {id:3,percentage:'7%',speciesName:'Moringa oleífera'},
//     {id:4,percentage:'5%',speciesName:'Cedrela odorada'},
//     {id:5,percentage:'5%',speciesName:'Cedrela odorada'},
// ]

// const co2 = [
//     {id:1,icon:<Plane/>,count:2000,text:'transatlantic flights'},
//     {id:2,icon:<Car/>,count:60000,text:'car rides'},
//     {id:3,icon:<RubberDuck/>,count:70000,text:'rubber ducks'},
// ]