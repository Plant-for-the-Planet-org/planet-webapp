import React, { ReactElement } from 'react'
import styles from './../styles/ThankYou.module.css'
import Close from '../../../../assets/images/icons/headerIcons/close'
import DownArrow from '../../../../assets/images/icons/DownArrow'
import GpayBlack from '../../../../assets/images/icons/donation/GpayBlack'
import Switch from '@material-ui/core/Switch';
import MaterialTextFeild from '../../../common/InputTypes/MaterialTextFeild'
import PlanetLogo from '../../../../assets/images/PlanetLogo'

interface Props {
    
}

function ThankYou({}: Props): ReactElement {
    const treeCountOptions = [10,20,50,150]
    const [customTreeCount, setCustomTreeCountLocal] = React.useState();
    const [treeCount, setTreeCount] = React.useState(50);
    const [isGift,setIsGift] = React.useState(false);
    const [isTaxDeductible,setIsTaxDeductible] = React.useState(false)
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerCloseIcon}>
                    <Close/> 
                </div>
                <div className={styles.headerTitle}>Thank You!</div>
            </div>


            <div className={styles.contributionAmount}>
                Your Donation of € 50 was paid with Google Pay
            </div>


            <div className={styles.contributionMessage}>
                We've sent an email to Felix about the gift. Your 50 trees will be planted by Eden Reforestation Project.
            </div>
            
           
            <div className={styles.horizontalLine} />

            <div className={styles.thankyouImageContainer}>
                <div className={styles.thankyouImage}>
                    <div className={styles.pfpLogo}>
                        <PlanetLogo/>
                    </div>
                    <div className={styles.donationCount}>
                        I just donated <br/> 50 trees.
                    </div>
                </div>
            </div>
            

            {/* <div className={styles.buttonsContainer}>
                <div className={styles.downloadButton}>

                </div>
                <div className={styles.downloadButton}>
                    Share
                </div>
                
            </div> */}
        </div>
    )
}

export default ThankYou
