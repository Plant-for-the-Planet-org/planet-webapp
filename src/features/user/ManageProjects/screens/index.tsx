import React from 'react'
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import BasicDetails from '../components/BasicDetails';
import StepContent from '@material-ui/core/StepContent';
import Paper from '@material-ui/core/Paper';
import styles from './../styles/StepForm.module.scss'
import ProjectMedia from '../components/ProjectMedia';
import DetailedAnalysis from '../components/DetailedAnalysis';
import ProjectSites from '../components/ProjectSites';
import ProjectSpending from '../components/ProjectSpending';
import { getRequest } from '../../../../utils/apiRequests/api';

function getSteps() {
    return ['Basic Details', 'Project Media', 'Detailed Analysis', 'Project Sites', 'Project Spending'];
}

export default function ManageProjects() {
    const [activeStep, setActiveStep] = React.useState(0);
    const [errorMessage, setErrorMessage] = React.useState('');
    const steps = getSteps();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = (message) => {
        setErrorMessage(message)
        setActiveStep(0);
    };

    const [projectGUID,setProjectGUID] = React.useState('proj_LAIzZDu2YAWBzQziOS0H0pMj')
    const [projectDetails,setProjectDetails] = React.useState({})

    React.useEffect(()=>{
        // Fetch details of the project 
        if(projectGUID !== '' && projectGUID !== null)
        getRequest(`/app/projects/${projectGUID}?_scope=extended&currency=EUR`).then((result)=>{
            setProjectDetails(result)
        })
    },[projectGUID])

    function getStepContent(step: number) {
        switch (step) {
            case 0:
                return <BasicDetails handleNext={handleNext} projectDetails={projectDetails} setProjectDetails={setProjectDetails} errorMessage={errorMessage} />;
            case 1:
                return <ProjectMedia handleNext={handleNext} handleBack={handleBack} projectDetails={projectDetails} setProjectDetails={setProjectDetails} projectGUID={projectGUID} handleReset={handleReset} />;
            case 2:
                return <DetailedAnalysis handleNext={handleNext} handleBack={handleBack} projectDetails={projectDetails} setProjectDetails={setProjectDetails} projectGUID={projectGUID} handleReset={handleReset} />;
            case 3:
                return <ProjectSites handleNext={handleNext} handleBack={handleBack} projectDetails={projectDetails} setProjectDetails={setProjectDetails} projectGUID={projectGUID} handleReset={handleReset} />;
            case 4:
                return <ProjectSpending handleNext={handleNext} handleBack={handleBack} projectDetails={projectDetails} setProjectDetails={setProjectDetails} projectGUID={projectGUID} handleReset={handleReset} />;
            default:
                return 'Unknown step';
        }
    }

    return (
        <div className={styles.mainContainer}>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel onClick={()=>setActiveStep(index)}>{label}</StepLabel>
                        <StepContent>
                            {getStepContent(index)}
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            {activeStep === steps.length && (
                <Paper square elevation={0}>
                    <Typography>All steps completed - you&apos;re finished</Typography>
                    <Button onClick={handleReset}>
                        Reset
                    </Button>
                </Paper>
            )}

        </div>
    );
}