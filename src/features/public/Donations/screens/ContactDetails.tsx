import React, { ReactElement } from 'react'
import styles from './../styles/ContactDetails.module.css'
import Close from './../../../../assets/images/icons/headerIcons/close'
import Switch from '@material-ui/core/Switch';
import MaterialTextFeild from './../../../common/InputTypes/MaterialTextFeild'
interface Props {
    
}

function ContactDetails({}: Props): ReactElement {

    const [isGift,setIsGift] = React.useState(false);
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerCloseIcon}>
                    <Close/> 
                </div>
                <div className={styles.headerTitle}>Contact Details</div>
            </div>


            <form>
            <MaterialTextFeild
                label="Custom CSS"
                variant="outlined"
            />
            <MaterialTextFeild
                label="Custom CSS 2"
                variant="outlined"
            />
            </form>

        </div>
    )
}

export default ContactDetails
