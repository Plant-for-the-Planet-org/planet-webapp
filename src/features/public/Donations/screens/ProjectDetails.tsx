import React, { ReactElement } from 'react'
import styles from './../styles/ProjectDetails.module.scss'
import MaterialRatings from '../../../common/InputTypes/Ratings';
import Plane from '../../../../assets/images/icons/project/Plane';
import Car from '../../../../assets/images/icons/project/Car';
import RubberDuck from '../../../../assets/images/icons/project/RubberDuck';
import BlackTree from '../../../../assets/images/icons/project/BlackTree';
import Location from '../../../../assets/images/icons/project/Location';
import WorldWeb from '../../../../assets/images/icons/project/WorldWeb';
import Email from '../../../../assets/images/icons/project/Email';

interface Props {
    
}

function ProjectDetails({}: Props): ReactElement {
    const [rating, setRating] = React.useState<number | null>(2);

    const infoProperties = [
        {id:1,title:'Degradation',value:'Approx. 1990'},
        {id:2,title:'First tree planted',value:'2013'},
        {id:3,title:'Planting Density',value:'500 per ha'},
        {id:4,title:'Survival rate',value:'63 %'},
        {id:5,title:'Employee count',value:'53'},
        {id:6,title:'Planting season',value:'June–October'}
    ]

    const financialReports = [
        {id:1,year:2020,cost:'€ 1.25M',linkReport:''},
        {id:2,year:2019,cost:'€ 1.25M',linkReport:''},
        {id:3,year:2018,cost:'€ 1.25M',linkReport:''},
        {id:4,year:2017,cost:'€ 1.25M',linkReport:''}
    ]

    const species = [
        {id:1,percentage:'35%',speciesName:'Tabebuia rosea'},
        {id:2,percentage:'12%',speciesName:'Swietenia humilis'},
        {id:3,percentage:'7%',speciesName:'Moringa oleífera'},
        {id:4,percentage:'5%',speciesName:'Cedrela odorada'},
        {id:5,percentage:'5%',speciesName:'Cedrela odorada'},
    ]

    const co2 = [
        {id:1,icon:<Plane/>,count:2000,text:'transatlantic flights'},
        {id:2,icon:<Car/>,count:60000,text:'car rides'},
        {id:3,icon:<RubberDuck/>,count:70000,text:'rubber ducks'},
    ]

    const contactDetails = [
        {id:1,icon:<BlackTree/>,text:'View Profile',link:''},
        {id:2,icon:<WorldWeb/>,text:'edenprojects.org',link:''},
        {id:3,icon:<Location/>,text:'303 W Foothill Blvd, Unit 13 Glendora, CA 91741, USA',link:''},
        {id:4,icon:<Email/>,text:'projects@edenprojects.org',link:''},
    ]
    return (
        <div className={styles.projectContainer}>
            <div className={styles.singleProject}>
                    <div className={styles.projectImage}>
                        <div className={styles.projectName}>
                            Acción Andina
                        </div>
                    </div>
                    <div className={styles.progressBar}>
                        <div className={styles.progressBarHighlight} />
                    </div>
                    
                    <div className={styles.projectCompleteInfo}>

                        <div className={styles.projectInfo}>
                            <div className={styles.projectData}>
                                <div className={styles.targetLocation}>
                                    <div className={styles.target}>
                                        102K planted •
                                    </div>
                                    <div className={styles.location}>
                                        Chile
                                    </div>   
                                </div>
                                <div className={styles.projectTPOName}>
                                    By Global Forest Generation
                                </div>
                            </div>
                            <div className={styles.projectCost}>
                                <div className={styles.costButton}>
                                        $1.78
                                </div>
                                <div className={styles.perTree}>
                                    per tree
                                </div>
                            </div>
                        </div>


                        <div className={styles.ratings}>
                            <div className={styles.calculatedRating}>
                                4.1
                            </div>
                            <div className={styles.ratingButton}>
                                <MaterialRatings
                                    name="simple-controlled"
                                    value={rating}
                                    size="small"
                                    onChange={(event, newValue) => {
                                        setRating(newValue);
                                    }}
                                    />
                            </div>
                        </div>

                        <div className={styles.projectDescription}>
                            Andes Action seeks to protect and restore one million hectares of high Andean priority ecosystems in six countries in the next 25 years. We work with on-the-ground conservation leaders with proven models to partner with rural and indigenous communities to reforest priority watersheds for biodiversity, local climate resilience, and water security.
                        </div>
                        
                        <div className={styles.projectInfoProperties}>
                            {infoProperties.map(info => (
                                <div key={info.id} className={styles.projectMoreInfoHalf}>
                                    <div className={styles.infoTitle}>
                                        {info.title}
                                    </div>
                                    <div className={styles.infoText}>
                                    {info.value}
                                    </div>
                                </div>
                            ))}
                            
                            <div className={styles.projectMoreInfo}>
                                <div className={styles.infoTitle}>
                                Land ownership
                                </div>
                                <div className={styles.infoText}>
                                Global Forest Generation Limited since 2008
                                </div>
                            </div>


                            <div className={styles.projectMoreInfo}>
                                <div className={styles.infoTitle}>
                                Why this site?
                                </div>
                                <div className={styles.infoText}>
                                The Sian Khan reserve is a biodiversity
                                hotspot and requires restoration after
                                deforestation for palm plantation.
                                </div>
                            </div>

                            <div className={styles.projectMoreInfo}>
                                <div className={styles.infoTitle}>
                                    External certifications
                                </div>
                                <div className={styles.infoText}>
                                    Gold Standard
                                    <div className={styles.infoTextButton}>
                                        View
                                    </div>

                                </div>
                            </div>

                            <div className={styles.projectMoreInfo}>
                                <div className={styles.infoTitle}>
                                    Project spending & Financial Reports
                                </div>
                                {financialReports.map(report=> (
                                    <div key={report.id} className={styles.infoText}>
                                        {report.year}
                                        <span>{report.cost}</span>
                                        <div className={styles.infoTextButton}>
                                            Report
                                        </div>
                                    </div>
                                ))}
                            </div>


                            <div className={styles.projectMoreInfo}>
                                <div className={styles.infoTitle}>
                                    {species.length} Species Planted
                                </div>
                                    {species.map(species =>(
                                        <div key={species.id}>
                                             <div className={styles.speciesProgress} style={{width:species.percentage}} />
                                             <div className={styles.infoText}>
                                                 {species.percentage}
                                                 <span style={{marginLeft:'11px',flexGrow:1}}>{species.speciesName}</span>
                                             </div>
                                         </div>
                                    ))}
                            </div>

                            <div className={styles.projectMoreInfo}>
                                <div className={styles.infoTitle}>
                                    22,540 tons captured is equal to
                                </div>
                                    {co2.map(co2 =>(
                                        <div key={co2.id}>
                                             <div className={styles.infoText}>
                                                 {co2.icon}
                                                 <span style={{marginLeft:'20px'}}>{co2.count}</span>
                                                 <span style={{marginLeft:'20px',flexGrow:1}}>{co2.text}</span>
                                             </div>
                                         </div>
                                    ))}
                            </div>


                            <div className={styles.projectMoreInfo}>
                                <div className={styles.infoTitle}>
                                    Contact Details
                                </div>
                                    {contactDetails.map(contactDetails =>(
                                        <div key={contactDetails.id}>
                                             <div className={styles.infoText+" "+styles.contactDetailsRow}>
                                                 {contactDetails.icon}
                                                 <span style={{marginLeft:'20px',flexGrow:1}}>{contactDetails.text}</span>
                                             </div>
                                         </div>
                                    ))}
                            </div>

                        </div>
                        

                    </div>
                    
                </div>
        </div>
        
    )
}

export default ProjectDetails
