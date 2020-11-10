import React, { ReactElement } from 'react'
import styles from './../../styles/ProjectDetails.module.scss'
import i18next from '../../../../../../i18n'
import { getPDFFile } from '../../../../../utils/getImageURL';
import getFormatedCurrency from '../../../../../utils/countryCurrency/getFormattedCurrency';
interface Props {
    project: any
}

function ProjectInfo({ project }: Props): ReactElement {
    const { useTranslation } = i18next;

    const { t, i18n } = useTranslation(['manageProjects', 'common']);

    const plantingSeasons= [
        { id: 0, title: t('common:january') },
        { id: 1, title: t('common:february') },
        { id: 2, title: t('common:march') },
        { id: 3, title: t('common:april') },
        { id: 4, title: t('common:may') },
        { id: 5, title: t('common:june') },
        { id: 6, title: t('common:july') },
        { id: 7, title: t('common:august') },
        { id: 8, title: t('common:september') },
        { id: 9, title: t('common:october') },
        { id: 10, title: t('common:november') },
        { id: 11, title: t('common:december') }
    ]

    const siteOwners= [
        { id: 1, title: t('manageProjects:siteOwnerPrivate'), value: 'private' },
        { id: 2, title: t('manageProjects:siteOwnerPublic'), value: 'public-property' },
        { id: 3, title: t('manageProjects:siteOwnerSmallHolding'), value: 'smallholding' },
        { id: 4, title: t('manageProjects:siteOwnerCommunal'), value: 'communal-land' },
        { id: 5, title: t('manageProjects:siteOwnerOwned'), value: 'owned-by-owner' },
        { id: 6, title: t('manageProjects:siteOwnerOther'), value: 'other' }
    ]

    const [ownerTypes, setOwnerTypes] = React.useState([])
    React.useEffect(() => {
        if (project.siteOwnerType && project.siteOwnerType.length > 0) {
            let newSiteOwners = ownerTypes;
            for (let i = 0; i < project.siteOwnerType.length; i++) {
                for (let j = 0; j < siteOwners.length; j++) {
                    if (siteOwners[j].value === project.siteOwnerType[i]) {
                        newSiteOwners.push(siteOwners[j].title)
                    }
                }
            }
            setOwnerTypes(newSiteOwners)
        }
    }, [])

    return (
        <div>
            <div className={styles.projectMoreInfoHalfContainer}>

                {project.yearAbandoned && (
                    <div className={styles.projectMoreInfoHalf}>
                        <div className={styles.infoTitle}>
                        {t('manageProjects:abandonment')}
                   </div>
                        <div className={styles.infoText}>
                        {t('common:approx')} {project.yearAbandoned}
                        </div>
                    </div>
                )}

                {project.firstTreePlanted && (
                    <div className={styles.projectMoreInfoHalf}>
                        <div className={styles.infoTitle}>
                            {t('manageProjects:firstTreePlanted')}
                        </div>
                        <div className={styles.infoText}>
                            {String(new Date(new Date(project.firstTreePlanted.date)).getFullYear())}
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

                {project.survivalRate && (
                    <div className={styles.projectMoreInfoHalf}>
                        <div className={styles.infoTitle}>
                        {t('manageProjects:survivalRate')}
                        </div>
                        <div className={styles.infoText}>
                            {project.survivalRate} %
                        </div>
                    </div>
                )}

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
                                        {ownerType}
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
                    {t('manageProjects:causeOfDegredation')}  
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
                            <div className={styles.infoText}>
                                {certificate.certifierName}
                                <a className={styles.infoTextButton} target={"_blank"} href={getPDFFile('projectCertificate', certificate.pdf)}>
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
                            <div className={styles.infoText}>
                                <span>
                                    {expense.year}
                                </span>
                                <span>
                                {getFormatedCurrency(
                                    i18n.language,
                                    'EUR',
                                    expense.amount
                                )}
                                </span>

                                <a className={styles.infoTextButton} target={"_blank"} href={getPDFFile('projectExpense', expense.pdf)}>
                                {t('common:view')}  
                                </a>
                            </div>
                        )
                    })}

                </div>
            )}

        </div>
    )
}

export default ProjectInfo
