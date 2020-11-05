import React from 'react'
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import BasicDetails from '../components/BasicDetails';
import StepContent from '@material-ui/core/StepContent';
import styles from './../styles/StepForm.module.scss'
import ProjectMedia from '../components/ProjectMedia';
import DetailedAnalysis from '../components/DetailedAnalysis';
import ProjectSites from '../components/ProjectSites';
import ProjectSpending from '../components/ProjectSpending';
import { getAuthenticatedRequest, putAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import SubmitForReview from '../components/SubmitForReview';
import { useRouter } from 'next/router';

function getSteps() {
    return ['Basic Details', 'Project Media', 'Detailed Analysis', 'Project Sites', 'Project Spending', 'Review'];
}

export default function ManageProjects({ GUID, session, project }: any) {
    const [activeStep, setActiveStep] = React.useState(0);
    const [errorMessage, setErrorMessage] = React.useState('');
    const steps = getSteps();
    const [isUploadingData, setIsUploadingData] = React.useState(false)


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

    const [projectGUID, setProjectGUID] = React.useState(GUID ? GUID : '')
    const [projectDetails, setProjectDetails] = React.useState(project ? project : {})

    const [reviewRequested, setReviewRequested] = React.useState(false)
    const router = useRouter();

    const submitForReview = () => {
        setIsUploadingData(true)
        const submitData = {
            reviewRequested: true
        }
        putAuthenticatedRequest(`/app/projects/${projectGUID}`, submitData, session).then((res) => {
            if (!res.code) {
                setProjectDetails(res)
                setErrorMessage('')
                setIsUploadingData(false)
            } else {
                if (res.code === 404) {
                    setErrorMessage('Project Not Found')
                    setIsUploadingData(false)
                }
                else {
                    setErrorMessage(res.message)
                    setIsUploadingData(false)
                }

            }
        })
    }
    React.useEffect(() => {
        if (projectDetails && projectDetails.reviewRequested) {
            setReviewRequested(true)
        }
    }, [projectDetails])
    React.useEffect(() => {
        // Fetch details of the project 
        if (projectGUID && session?.accessToken)
            getAuthenticatedRequest(`/app/profile/projects/${projectGUID}`, session).then((result) => {
                setProjectDetails(result)
            })
    }, [GUID, projectGUID])

    const [userLang,setUserLang] = React.useState('en')
    React.useEffect(()=>{
        if (localStorage.getItem('language')) {
            let userLang = localStorage.getItem('language');
            if (userLang) setUserLang(userLang);
          }
    },[])

    function getStepContent(step: number) {
        switch (step) {
            case 0:
                return <BasicDetails handleNext={handleNext} session={session} projectDetails={projectDetails} setProjectDetails={setProjectDetails} errorMessage={errorMessage} setProjectGUID={setProjectGUID} projectGUID={projectGUID} setErrorMessage={setErrorMessage} />;
            case 1:
                return <ProjectMedia handleNext={handleNext} session={session} handleBack={handleBack} projectDetails={projectDetails} setProjectDetails={setProjectDetails} projectGUID={projectGUID} handleReset={handleReset} />;
            case 2:
                return <DetailedAnalysis userLang={userLang} handleNext={handleNext} session={session} handleBack={handleBack} projectDetails={projectDetails} setProjectDetails={setProjectDetails} projectGUID={projectGUID} handleReset={handleReset} />;
            case 3:
                return <ProjectSites handleNext={handleNext} session={session} handleBack={handleBack} projectDetails={projectDetails} setProjectDetails={setProjectDetails} projectGUID={projectGUID} handleReset={handleReset} />;
            case 4:
                return <ProjectSpending userLang={userLang} handleNext={handleNext} session={session} handleBack={handleBack} projectDetails={projectDetails} setProjectDetails={setProjectDetails} projectGUID={projectGUID} handleReset={handleReset} />;
            case 5:
                return <SubmitForReview handleBack={handleBack} reviewRequested={reviewRequested} submitForReview={submitForReview} isUploadingData={isUploadingData} projectGUID={projectGUID} handleReset={handleReset} />;
            default:
                return 'Unknown step';
        }
    }

    return (
        <div className={styles.mainContainer}>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel onClick={() => setActiveStep(index)}>{label}</StepLabel>
                        <StepContent>
                            {getStepContent(index)}
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
        </div>
    );
}