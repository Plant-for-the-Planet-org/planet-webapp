import React, { ReactElement } from 'react'
import styles from './../../styles/ProjectDetails.module.scss'
import i18next from '../../../../../i18n/'
import { getPDFFile } from '../../../../utils/getImageURL';
import getFormatedCurrency from '../../../../utils/countryCurrency/getFormattedCurrency';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import InfoIcon from '../../../../../public/assets/images/icons/manageProjects/Info';

interface Props {
    project: any
}

function ProjectInfo({ project }: Props): ReactElement {
    const { useTranslation } = i18next;

    const { t, i18n, ready } = useTranslation(['manageProjects', 'common']);

    const plantingSeasons = [
        { id: 0, title: ready ? t('common:january') : '' },
        { id: 1, title: ready ? t('common:february') : '' },
        { id: 2, title: ready ? t('common:march') : '' },
        { id: 3, title: ready ? t('common:april') : '' },
        { id: 4, title: ready ? t('common:may') : '' },
        { id: 5, title: ready ? t('common:june') : '' },
        { id: 6, title: ready ? t('common:july') : '' },
        { id: 7, title: ready ? t('common:august') : '' },
        { id: 8, title: ready ? t('common:september') : '' },
        { id: 9, title: ready ? t('common:october') : '' },
        { id: 10, title: ready ? t('common:november') : '' },
        { id: 11, title: ready ? t('common:december') : '' }
    ]

    const siteOwners = [
        { id: 1, title: ready ? t('manageProjects:siteOwnerPrivate') : '', value: 'private' },
        { id: 2, title: ready ? t('manageProjects:siteOwnerPublic') : '', value: 'public-property' },
        { id: 3, title: ready ? t('manageProjects:siteOwnerSmallHolding') : '', value: 'smallholding' },
        { id: 4, title: ready ? t('manageProjects:siteOwnerCommunal') : '', value: 'communal-land' },
        { id: 5, title: ready ? t('manageProjects:siteOwnerOwned') : '', value: 'owned-by-owner' },
        { id: 6, title: ready ? t('manageProjects:siteOwnerOther') : '', value: 'other' }
    ]

    const [ownerTypes, setOwnerTypes] = React.useState([])
    React.useEffect(() => {
        if (ready && project.siteOwnerType && project.siteOwnerType.length > 0) {
            let newSiteOwners = [];

            for (let i = 0; i < project.siteOwnerType.length; i++) {
                let translatedOwnerType = siteOwners.find((element)=>element.value === project.siteOwnerType[i]);
                newSiteOwners.push(translatedOwnerType.title);
            }

            setOwnerTypes(newSiteOwners)
        }
    }, [ready])

    const expenseAmount = project.expenses.map((expense:any)=>expense.amount);    
    const calculatePercentage =(amount:any)=>{
        const maxAmount = Math.max(...expenseAmount)
        const percentage = (amount/maxAmount) * 100;
        return `${percentage}%`
    }

    

    return ready ? (
        <div>
            <div className={styles.projectMoreInfoHalfContainer}>

                {project.yearAbandoned && (
                    <div className={styles.projectMoreInfoHalf}>
                        <div className={styles.infoTitle}>
                            {t('manageProjects:abandonment')}
                            <div style={{ position: 'absolute', width: 'fit-content',top:'0px',right:'18px' }}>
                                <div className={styles.popover}>
                                    <InfoIcon />
                                    <div className={styles.popoverContent} style={{ left: '-140px' }}>
                                        <p>
                                            {t('manageProjects:yearAbandonedInfo')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.infoText}>
                            {t('common:approx')} {project.yearAbandoned}
                        </div>
                    </div>
                )}

                {project.firstTreePlanted && project.firstTreePlanted.date && (
                    <div className={styles.projectMoreInfoHalf}>
                        <div className={styles.infoTitle}>
                            {t('manageProjects:firstTreePlanted')}
                        </div>
                        <div className={styles.infoText}>
                            {formatDate(project.firstTreePlanted.date)}
                        </div>
                    </div>
                )}

                {project.plantingDensity && (
                    <div className={styles.projectMoreInfoHalf}>
                        <div className={styles.infoTitle}>
                            {t('manageProjects:plantingDensity')}
                        </div>
                        <div className={styles.infoText}>
                            {project.plantingDensity} {t('manageProjects:treePerHa')}
                        </div>
                    </div>
                )}

                {/* {project.survivalRate && (
                    <div className={styles.projectMoreInfoHalf}>
                        <div className={styles.infoTitle}>
                            {t('manageProjects:survivalRate')}
                            <div style={{ position: 'absolute', width: 'fit-content',top:'0px',right:'18px' }}>
                                <div className={styles.popover}>
                                    <InfoIcon />
                                    <div className={styles.popoverContent} style={{ left: '-160px' }}>
                                        <p>
                                            {t('manageProjects:survivalRateInfo')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.infoText}>
                            {project.survivalRate} %
                        </div>
                    </div>
                )} */}

                {project.employeesCount && (
                    <div className={styles.projectMoreInfoHalf}>
                        <div className={styles.infoTitle}>
                            {t('manageProjects:employees')}
                        </div>
                        <div className={styles.infoText}>
                            {project.employeesCount}
                        </div>
                    </div>
                )}

                {project.plantingSeasons && (
                    <div className={styles.projectMoreInfoHalf}>
                        <div className={styles.infoTitle}>
                            {t('manageProjects:plantingSeasons')}
                        </div>
                        <div className={styles.infoText}>
                            {project.plantingSeasons.map((season: any, index: any) => {
                                return (
                                    <>
                                        {plantingSeasons[season - 1].title}
                                        {index === (project.plantingSeasons.length - 2) ? ' and ' : index === (project.plantingSeasons.length - 1) ? '.' : ', '}
                                    </>
                                )
                            })}
                        </div>
                    </div>
                )}

            </div>

            {project.mainChallenge && (
                <div className={styles.projectMoreInfo}>
                    <div className={styles.infoTitle}>
                        {t('manageProjects:mainChallenge')}
                    </div>
                    <div className={styles.infoText}>
                        {project.mainChallenge}
                    </div>
                </div>
            )}


            {project.siteOwnerName && (
                <div className={styles.projectMoreInfo}>
                    <div className={styles.infoTitle}>
                        {t('manageProjects:siteOwnership')}
                    </div>
                    {project.siteOwnerType && (
                        <div className={styles.infoText} style={{ fontWeight: 'bold' }}>
                            {ownerTypes.map((ownerType: any, index: any) => {
                                return (
                                    <>
                                        {t(`manageProjects:${ownerType}`)}
                                        {index === (ownerTypes.length - 2) ? ' and ' : index === (ownerTypes.length - 1) ? '.' : ', '}
                                    </>
                                )
                            })}
                        </div>
                    )}

                    <div className={styles.infoText}>
                        {project.siteOwnerName} since {project.yearAcquired ? project.yearAcquired : ''}
                    </div>
                </div>
            )}

            {project.degradationCause && (
                <div className={styles.projectMoreInfo}>
                    <div className={styles.infoTitle}>
                        {t('manageProjects:causeOfDegradation')}
                    </div>
                    <div className={styles.infoText}>
                        {project.degradationCause}
                    </div>
                </div>
            )}


            {project.motivation && (
                <div className={styles.projectMoreInfo}>
                    <div className={styles.infoTitle}>
                        {t('manageProjects:whyThisSite')}
                    </div>
                    <div className={styles.infoText}>
                        {project.motivation}
                    </div>
                </div>
            )}

            {project.longTermPlan && (
                <div className={styles.projectMoreInfo}>
                    <div className={styles.infoTitle}>
                        {t('manageProjects:longTermProtection')}
                    </div>
                    <div className={styles.infoText}>
                        {project.longTermPlan}
                    </div>
                </div>
            )}

            {project.certificates && project.certificates.length > 0 && (
                <div className={styles.projectMoreInfo}>
                    <div className={styles.infoTitle}>
                        {t('manageProjects:externalCertifications')}
                    </div>

                    {project.certificates.map((certificate: any) => {
                        return (
                            <div key={certificate.id} className={styles.infoText}>
                                {certificate.certifierName}
                                <a className={styles.infoTextButton} target="_blank" rel="noopener noreferrer"
                                  href={getPDFFile('projectCertificate', certificate.pdf)}>
                                    {t('common:view')}
                                </a>
                            </div>
                        )
                    })}

                </div>
            )}

           
            {project.expenses && project.expenses.length > 0 && (
                <div className={styles.projectMoreInfo}>
                    <div className={styles.infoTitle}>
                        {t('manageProjects:projectSpendingFinancial')}
                    </div>

                    {project.expenses.map((expense: any) => {
                        return (
                            <div key={expense.id} className={styles.infoText} style={{justifyContent:'normal'}}>
                                 <span>
                                    {expense.year}
                                </span>
                                <div style={{marginLeft:'6px',display:'flex',flexDirection:'row',position:'relative',width:'100%'}}>
                                <div style={{backgroundColor:'#F2F2F7',width:calculatePercentage(expense.amount),height:'20px',position:'absolute',zIndex:1}}></div>

                                    <span style={{flexGrow:1,textAlign:'center',zIndex:2}}>
                                        {getFormatedCurrency(
                                            i18n.language,
                                            'EUR',
                                            expense.amount
                                        )}
                                    </span>

                                    <a className={styles.infoTextButton} target="_blank" rel="noopener noreferrer"
                                      href={getPDFFile('projectExpense', expense.pdf)} style={{zIndex:2}}>
                                        {t('common:view')}
                                    </a>
                                </div>
                            </div>
                        )
                    })}

                </div>
            )}

        </div>
    ) : <></>;
}

export default ProjectInfo
