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
import i18next from './../../../../../i18n';

const { useTranslation } = i18next;

export default function ManageProjects({ GUID, token, project }: any) {
    const { t, i18n, ready } = useTranslation(['manageProjects']);

    function getSteps() {
        return [
          ready ? t('manageProjects:basicDetails') : '',
          ready ? t('manageProjects:projectMedia') : '',
          ready ? t('manageProjects:detailedAnalysis') : '',
          ready ? t('manageProjects:projectSites') : '',
          ready ? t('manageProjects:projectSpending') : '',
          ready ? t('manageProjects:review') : ''
        ];
    }
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
        putAuthenticatedRequest(`/app/projects/${projectGUID}`, submitData, token).then((res) => {
            if (!res.code) {
                setProjectDetails(res)
                setErrorMessage('')
                setIsUploadingData(false)
            } else {
                if (res.code === 404) {
                    setErrorMessage(ready ? t('manageProjects:projectNotFound') : '')
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
        if (projectGUID && token)
            getAuthenticatedRequest(`/app/profile/projects/${projectGUID}`, token).then((result) => {
                setProjectDetails(result)
            })
    }, [GUID, projectGUID])

    const [userLang,setUserLang] = React.useState('en')
    React.useEffect(()=>{
        if (localStorage.getItem('language')) {
            const userLang = localStorage.getItem('language');
            if (userLang) setUserLang(userLang);
          }
    },[])

    function getStepContent(step: number) {
        switch (step) {
            case 0:
                return <BasicDetails handleNext={handleNext} token={token} projectDetails={projectDetails} setProjectDetails={setProjectDetails} errorMessage={errorMessage} setProjectGUID={setProjectGUID} projectGUID={projectGUID} setErrorMessage={setErrorMessage} />;
            case 1:
                return <ProjectMedia handleNext={handleNext} token={token} handleBack={handleBack} projectDetails={projectDetails} setProjectDetails={setProjectDetails} projectGUID={projectGUID} handleReset={handleReset} />;
            case 2:
                return <DetailedAnalysis userLang={userLang} handleNext={handleNext} token={token} handleBack={handleBack} projectDetails={projectDetails} setProjectDetails={setProjectDetails} projectGUID={projectGUID} handleReset={handleReset} />;
            case 3:
                return <ProjectSites handleNext={handleNext} token={token} handleBack={handleBack} projectGUID={projectGUID} handleReset={handleReset} />;
            case 4:
                return <ProjectSpending userLang={userLang} handleNext={handleNext} token={token} handleBack={handleBack} projectGUID={projectGUID} handleReset={handleReset} />;
            case 5:
                return <SubmitForReview handleBack={handleBack} reviewRequested={reviewRequested} projectDetails={projectDetails} submitForReview={submitForReview} isUploadingData={isUploadingData} projectGUID={projectGUID} handleReset={handleReset} />;
            default:
                return <BasicDetails handleNext={handleNext} token={token} projectDetails={projectDetails} setProjectDetails={setProjectDetails} errorMessage={errorMessage} setProjectGUID={setProjectGUID} projectGUID={projectGUID} setErrorMessage={setErrorMessage} />;
        }
    }

    return ready ? (
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
    ) : null;
}