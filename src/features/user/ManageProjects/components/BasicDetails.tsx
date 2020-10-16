import React, { ReactElement } from 'react'
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import { useForm } from 'react-hook-form';
import i18next from './../../../../../i18n'
import ToggleSwitch from '../../../common/InputTypes/ToggleSwitch';
import styles from './../styles/StepForm.module.scss'
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
const { useTranslation } = i18next;

interface Props {
    
}

export default function BasicDetails({}: Props): ReactElement {
    const { t, i18n } = useTranslation(['manageProjects']);

    const [receiveDonations,setReceiveDonations] = React.useState(true)
    const [projectAnalysis,setProjectAnalysis] = React.useState(true)
    const [reviewerExpense,setReviewerExpense] = React.useState(true)
    const [publishProject,setPublishProject] = React.useState(true)

    const defaultBasicDetails = {
        projectName:"",
        projectURL:"",
        projectType:"",
        treeTarget:0,
        website:"",
        aboutProject:"",
        costPerTree:0,
    }


    const [basicDetails,setBasicDetails] = React.useState(defaultBasicDetails);

    const changeBasicDetails = (e: any) => {
        setBasicDetails({ ...basicDetails, [e.target.name]: e.target.value });
    };

    const { register, handleSubmit, errors } = useForm();

    const onSubmit = (data: any) => {

    };

    
    return (
        <div className={styles.stepContainer}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.formField}>
                    <MaterialTextField
                        inputRef={register({ required: true })}
                        label={t('manageProjects:projectName')}
                        variant="outlined"
                        name="projectName"
                        onChange={changeBasicDetails}
                        // defaultValue={}
                    />
                </div>
                
                <div className={styles.formField}>
                    <MaterialTextField
                        inputRef={register({ required: true })}
                        label={t('manageProjects:projectType')}
                        variant="outlined"
                        name="projectType"
                        onChange={changeBasicDetails}
                        // defaultValue={}
                    />
                </div>
                
                <div className={styles.formField}>
                    <MaterialTextField
                        inputRef={register({ required: true })}
                        label={t('manageProjects:projectURL')}
                        variant="outlined"
                        name="projectURL"
                        onChange={changeBasicDetails}
                        // defaultValue={}
                    />
                </div>
                
                <div className={styles.formField}>
                    <MaterialTextField
                        inputRef={register({ required: true })}
                        label={t('manageProjects:treeTarget')}
                        variant="outlined"
                        name="treeTarget"
                        onChange={changeBasicDetails}
                        // defaultValue={}
                    />
                </div>

                <div className={styles.formField}>
                    <MaterialTextField
                        inputRef={register({ required: true })}
                        label={t('manageProjects:website')}
                        variant="outlined"
                        name="website"
                        onChange={changeBasicDetails}
                        // defaultValue={}
                    />
                </div>

                <div className={styles.formField}>
                    <MaterialTextField
                        inputRef={register({ required: true })}
                        label={t('manageProjects:aboutProject')}
                        variant="outlined"
                        name="aboutProject"
                        onChange={changeBasicDetails}
                        // defaultValue={}
                    />  
                </div>
                

                <div className={styles.formField}>
                    <ToggleSwitch
                        checked={receiveDonations}
                        onChange={()=>setReceiveDonations(!receiveDonations)}
                        name="receiveDonations"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                    <p>Receive Donations</p>
                </div>

                <div className={styles.formField}>
                    <MaterialTextField
                        inputRef={register({ required: true })}
                        label={t('manageProjects:costPerTree')}
                        variant="outlined"
                        name="costPerTree"
                        onChange={changeBasicDetails}
                        // defaultValue={}
                    />
                </div>

                <div className={styles.formField}>
                    <ToggleSwitch
                        checked={reviewerExpense}
                        onChange={()=>setReviewerExpense(!reviewerExpense)}
                        name="reviewerExpense"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                    <p>I will provide lodging, site access and local 
                    transport if a reviewer is sent by 
                    Plant-for-the-Planet.
                    </p>
                </div>

                <div className={styles.formField}>
                    <ToggleSwitch
                        checked={publishProject}
                        onChange={()=>setPublishProject(!publishProject)}
                        name="publishProject"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                    <p>Publish Project (if projectstatus=Approved)</p>
                </div>

                <div className={styles.formField}>
                    <ToggleSwitch
                        checked={projectAnalysis}
                        onChange={()=>setProjectAnalysis(!projectAnalysis)}
                        name="projectAnalysis"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                    <p>
                    Detailed Project Analysis if projectstatus=Approved
                    Activate once all relevant data is submitted via Tree Mapper.
                    </p>
                </div>

                <div className={styles.formField}>
                    <AnimatedButton 
                        className={styles.continueButton}
                    >
                        Save and Continue
                    </AnimatedButton>
                </div>

            </form>
           
        </div>
    )
}
