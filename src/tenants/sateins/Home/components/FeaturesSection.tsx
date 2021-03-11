import styles from './../styles/sateins.module.scss'

export default function FeaturesSection(props:any){
    return(
        <div className={styles.featuresMainContainer}>
            <div className={styles.featuresContainerText}>
                {props.FeaturesSectionData.featureText}
            </div>
            <div className={styles.featuresContainerDivider}></div>
            <div className={styles.featuresSection}>
                <img src={"https://waldrekord.plant-for-the-planet.org/tenants/sateins/images/sat1-sign.jpg"} />
            </div>
        </div>
    )
}
