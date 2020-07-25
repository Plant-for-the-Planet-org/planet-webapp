import React, { ReactElement } from 'react'
import styles from './../styles/TreeDonation.module.scss'
import Close from './../../../../assets/images/icons/headerIcons/close'
import DownArrow from './../../../../assets/images/icons/DownArrow'
import GpayBlack from '../../../../assets/images/icons/donation/GpayBlack'
import Switch from '@material-ui/core/Switch';
import MaterialTextFeild from './../../../common/InputTypes/MaterialTextFeild'

interface Props {
    onClose:any,
    project:any
}

function TreeDonation({onClose,project}: Props): ReactElement {
    const treeCountOptions = [10,20,50,150]
    const [customTreeCount, setCustomTreeCountLocal] = React.useState();
    const [treeCount, setTreeCount] = React.useState(50);
    const [isGift,setIsGift] = React.useState(false);
    const [isTaxDeductible,setIsTaxDeductible] = React.useState(false)

    const [currency,setCurrency] = React.useState(project.currency)
    const [treeCost,setTreeCost] = React.useState(project.treeCost)
    return (
        <div className={styles.treeDonationcontainer}>
            <div className={styles.cardContainer}>

           
            <div className={styles.header}>
                <div onClick={()=>onClose()} className={styles.headerCloseIcon}>
                    <Close/> 
                </div>
                <div className={styles.headerTitle}>Tree Donation</div>
            </div>


            <div className={styles.plantProjectName}>
                To Yucatan Reforestation by Plant-for-the-Planet 
            </div>

            <div className={styles.currencyRate}>
                <div className={styles.currency}>
                    {currency} 
                </div>
                <div className={styles.downArrow}>
                    <DownArrow color={"#87B738"} />
                </div>
                <div className={styles.rate}>
                {project.treeCost.toFixed(2)} per tree
                </div>
            </div>
            
            <div className={styles.isGiftDonation}>
                <div className={styles.isGiftDonationText}>
                    My Donation is a gift to someone
                </div>
                <Switch
                    checked={isGift}
                    onChange={()=>setIsGift(!isGift)}
                    name="checkedA"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
            </div>

        {isGift ? (
            <div className={styles.giftsContainer}>
            <div className={styles.singleGiftContainer}>
                <div className={styles.singleGiftTitle}>Gift Recepient</div>
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
                        label="Gift Message"
                        variant="outlined"
                    />
                </div>
            </div>
            </div>
        ) : null}
           

            <div className={styles.selectTreeCount}>
                {treeCountOptions.map(option =>(
                    <div onClick={()=>setTreeCount(option)} key={option} className={treeCount === option ? styles.treeCountOptionSelected  : styles.treeCountOption}>
                        <div className={ styles.treeCountOptionTrees}>
                            {option}
                        </div>
                        <div className={styles.treeCountOptionTrees}>Trees</div>
                    </div>
                ) )}
                {customTreeCount ? 
                    <div className={styles.treeCountOptionSelected} style={{minWidth:'65%',flexDirection:'row'}}>
                        <input className={styles.customTreeInput} type="text"/>
                        <div className={styles.treeCountOptionTrees}>Trees</div>
                    </div> 
                    : 
                    <div className={ styles.treeCountOption}  style={{minWidth:'65%'}}>
                        <div className={styles.treeCountOptionTrees}>____ Trees</div>
                    </div> 
                }
            </div>

            <div className={styles.isTaxDeductible}>
                <div className={styles.isTaxDeductibleText}>
                    Send me a tax deduction receipt for
                </div>
                <Switch
                    checked={isTaxDeductible}
                    onChange={()=>setIsTaxDeductible(!isTaxDeductible)}
                    name="checkedB"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
            </div>
            <div className={styles.taxDeductible}>
                <div className={styles.taxDeductibleCountry}>
                    Germany
                </div>
                <div className={styles.downArrow}>
                    <DownArrow color={"#2F3336"} />
                </div>
            </div>

            <div className={styles.horizontalLine} />

            <div className={styles.finalTreeCount}>
                <div className={styles.totalCost}>{currency} {treeCount * treeCost.toFixed(2)} </div>
                <div className={styles.totalCostText}>
                for {treeCount} Trees
                </div>
            </div>

            <div className={styles.actionButtonsContainer}>
                <div>
                    <GpayBlack/>
                </div>
                <div className={styles.actionButtonsText}>OR</div>
                <div className={styles.continueButton}>Continue</div>
            </div>
            </div>
        </div>
    )
}

export default TreeDonation
