import React, { ReactElement } from 'react'
import styles from './../styles/ContactDetails.module.scss'
import BackArrow from '../../../../assets/images/icons/headerIcons/BackArrow'
import Switch from '@material-ui/core/Switch';
import MaterialTextFeild from './../../../common/InputTypes/MaterialTextFeild'
interface Props {
    
}

function ContactDetails({}: Props): ReactElement {

    const [isCompany,setIsCompany] = React.useState(false);
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerBackIcon}>
                    <BackArrow/> 
                </div>
                <div className={styles.headerTitle}>Contact Details</div>
            </div>
            <form>
                <div className={styles.formRow}>
                    <MaterialTextFeild
                        label="First Name"
                        variant="outlined"
                    />
                    <div style={{width:'20px'}}></div>
                    <MaterialTextFeild
                        label="Last Name"
                        variant="outlined"
                    />
                </div>
                <div className={styles.formRow}>
                    <MaterialTextFeild
                        label="Email"
                        variant="outlined"
                    />
                </div>
                <div className={styles.formRow}>
                    <MaterialTextFeild
                        label="Address Line 1"
                        variant="outlined"
                    />
                </div>
                <div className={styles.formRow}>
                    <MaterialTextFeild
                        label="City"
                        variant="outlined"
                    />
                    <div style={{width:'20px'}}></div>
                    <MaterialTextFeild
                        label="Zip Code"
                        variant="outlined"
                    />
                </div>
                <div className={styles.formRow}>
                    <MaterialTextFeild
                        label="Country"
                        variant="outlined"
                    />
                </div>

                <div className={styles.isCompany}>
                    <div className={styles.isCompanyText}>
                        This is a Company Donation
                    </div>
                    <Switch
                        checked={isCompany}
                        onChange={()=>setIsCompany(!isCompany)}
                        name="checkedB"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                </div>
                <div className={styles.formRow}>
                    <MaterialTextFeild
                        label="Company Name"
                        variant="outlined"
                    />
                </div>

                <div className={styles.horizontalLine} />

                <div className={styles.finalTreeCount}>
                    <div className={styles.totalCost}>€ 50,76</div>
                    <div className={styles.totalCostText}>
                    for 50 Trees
                    </div>
                </div>

                <div className={styles.actionButtonsContainer}>
                    <div className={styles.continueButton}>Continue</div>
                </div>
            </form>
        </div>
    )
}

export default ContactDetails
