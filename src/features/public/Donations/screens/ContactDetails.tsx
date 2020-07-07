import React, { ReactElement } from 'react'
import styles from './../styles/ContactDetails.module.css'
import Close from './../../../../assets/images/icons/headerIcons/close'
import DownArrow from './../../../../assets/images/icons/DownArrow'
import GpayBlack from './../../../../assets/images/icons/GpayBlack'
import Switch from '@material-ui/core/Switch';

interface Props {
    
}

function ContactDetails({}: Props): ReactElement {
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
                <div className={styles.headerTitle}>Contact Details</div>
            </div>


            

        </div>
    )
}

export default ContactDetails
