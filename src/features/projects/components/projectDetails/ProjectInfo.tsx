import React, { ReactElement } from 'react';
import styles from './../../styles/ProjectDetails.module.scss';
import { useTranslation } from 'next-i18next';
import { getPDFFile } from '../../../../utils/getImageURL';
import getFormatedCurrency from '../../../../utils/countryCurrency/getFormattedCurrency';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import InfoIcon from '../../../../../public/assets/images/icons/manageProjects/Info';

interface Props {
  project: any;
}

function ProjectInfo({ project }: Props): ReactElement {
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
    { id: 11, title: ready ? t('common:december') : '' },
  ];

  const siteOwners = [
    {
      id: 1,
      title: ready ? t('manageProjects:siteOwnerPrivate') : '',
      value: 'private',
    },
    {
      id: 2,
      title: ready ? t('manageProjects:siteOwnerPublic') : '',
      value: 'public-property',
    },
    {
      id: 3,
      title: ready ? t('manageProjects:siteOwnerSmallHolding') : '',
      value: 'smallholding',
    },
    {
      id: 4,
      title: ready ? t('manageProjects:siteOwnerCommunal') : '',
      value: 'communal-land',
    },
    {
      id: 5,
      title: ready ? t('manageProjects:siteOwnerOwned') : '',
      value: 'owned-by-owner',
    },
    {
      id: 6,
      title: ready ? t('manageProjects:siteOwnerOther') : '',
      value: 'other',
    },
  ];
  const [ownerTypes, setOwnerTypes] = React.useState([]);
  React.useEffect(() => {
    if (ready && project.siteOwnerType && project.siteOwnerType.length > 0) {
      const updatedSiteOwners = [];

      for (let i = 0; i < project.siteOwnerType.length; i++) {
        const translatedOwnerType = siteOwners.find(
          (element) => element.value === project.siteOwnerType[i]
        );
        updatedSiteOwners.push(translatedOwnerType.title);
      }

      setOwnerTypes(updatedSiteOwners);
    }
  }, [ready, i18n.language]);

  React.useEffect(() => {
    if (
      ready &&
      project.metadata.landOwnershipType &&
      project.metadata.landOwnershipType.length > 0
    ) {
      const updatedSiteOwners = [];

      for (let i = 0; i < project.metadata.landOwnershipType.length; i++) {
        const translatedOwnerType = siteOwners.find(
          (element) => element.value === project.metadata.landOwnershipType[i]
        );
        updatedSiteOwners.push(translatedOwnerType.title);
      }

      setOwnerTypes(updatedSiteOwners);
    }
  }, [ready, i18n.language]);

  const expenseAmount = project.expenses.map((expense: any) => expense.amount);
  const calculatePercentage = (amount: any) => {
    const maxAmount = Math.max(...expenseAmount);
    const percentage = (amount / maxAmount) * 100;
    return `${percentage}%`;
  };

  const addZeroToDate = (val) => {
    const arr = val.split('-');
    const newDateArr = [arr[0]];
    if (arr[1].length === 1) {
      newDateArr.push(`0${arr[1]}`);
    } else {
      newDateArr.push(arr[1]);
    }
    if (arr[2].length === 1) {
      newDateArr.push(`0${arr[2]}`);
    } else {
      newDateArr.push(arr[2]);
    }
    return newDateArr.join('-');
  };

  return ready ? (
    <div className={styles.projectInfoContainer}>
      <div className={styles.projectMoreInfoHalfContainer}>
        {project?.metadata?.yearAbandoned !== 0 && (
          <div className={styles.projectMoreInfoHalf}>
            <div className={styles.infoTitle}>
              {t('manageProjects:abandonment')}
              <div
                style={{
                  position: 'absolute',
                  width: 'fit-content',
                  top: '0px',
                  right: '18px',
                }}
              >
                <div className={styles.popover}>
                  <InfoIcon />
                  <div
                    className={styles.popoverContent}
                    style={{ left: '-140px' }}
                  >
                    <p>{t('manageProjects:yearAbandonedInfo')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.infoText}>
              {t('common:approx')} {project.yearAbandoned}
            </div>
          </div>
        )}
        {project && project.metadata && project.metadata.firstTreePlanted && (
          <div className={styles.projectMoreInfoHalf}>
            <div className={styles.infoTitle}>
              {t('manageProjects:firstTreePlanted')}
            </div>
            <div className={styles.infoText}>
              {formatDate(
                project.metadata.firstTreePlanted?.split('-')[1].length === 1 ||
                  project.metadata.firstTreePlanted?.split('-')[2].length === 1
                  ? addZeroToDate(project.metadata.firstTreePlanted)
                  : project.metadata.firstTreePlanted
              )}
            </div>
          </div>
        )}

        {project?.plantingDensity && (
          <div className={styles.projectMoreInfoHalf}>
            <div className={styles.infoTitle}>
              {t('manageProjects:plantingDensity')}
            </div>
            <div className={styles.infoText}>
              {project.plantingDensity}
              {project?.metadata?.maxPlantingDensity
                ? `-${project.metadata.maxPlantingDensity} ${t(
                    'manageProjects:treePerHa'
                  )}`
                : ` ${t('manageProjects:treePerHa')}`}
            </div>
          </div>
        )}

        {project?.metadata?.employeesCount !== 0 && (
          <div className={styles.projectMoreInfoHalf}>
            <div className={styles.infoTitle}>
              {t('manageProjects:employees')}
            </div>
            <div className={styles.infoText}>
              {project.metadata.employeesCount}
            </div>
          </div>
        )}

        {project?.metadata?.activitySeasons &&
          project?.metadata?.activitySeasons.length > 0 && (
            <div className={styles.projectMoreInfoHalf}>
              <div className={styles.infoTitle}>
                {t('manageProjects:protectionSeasons')}
              </div>
              <div className={styles.infoText}>
                {project.metadata.activitySeasons.map(
                  (season: any, index: any) => {
                    return (
                      <React.Fragment key={plantingSeasons[season - 1].title}>
                        {plantingSeasons[season - 1].title}
                        {index ===
                        project.metadata.activitySeasons.length - 2 ? (
                          <> {t('manageProjects:and')} </>
                        ) : index ===
                          project.metadata.activitySeasons.length - 1 ? (
                          '.'
                        ) : (
                          ', '
                        )}
                      </React.Fragment>
                    );
                  }
                )}
              </div>
            </div>
          )}

        {project?.metadata?.plantingSeasons &&
          project?.metadata?.plantingSeasons.length > 0 && (
            <div className={styles.projectMoreInfoHalf}>
              <div className={styles.infoTitle}>
                {t('manageProjects:plantingSeasons')}
              </div>
              <div className={styles.infoText}>
                {project.metadata.plantingSeasons.map(
                  (season: any, index: any) => {
                    return (
                      <React.Fragment key={plantingSeasons[season - 1].title}>
                        {plantingSeasons[season - 1].title}
                        {index ===
                        project.metadata.plantingSeasons.length - 2 ? (
                          <> {t('manageProjects:and')} </>
                        ) : index ===
                          project.metadata.plantingSeasons.length - 1 ? (
                          '.'
                        ) : (
                          ', '
                        )}
                      </React.Fragment>
                    );
                  }
                )}
              </div>
            </div>
          )}
      </div>

      {project && project.metadata && project.metadata.mainChallenge && (
        <div className={styles.projectMoreInfo}>
          <div className={styles.infoTitle}>
            {t('manageProjects:mainChallenge')}
          </div>
          <div className={styles.infoText}>
            {project.metadata.mainChallenge}
          </div>
        </div>
      )}

      <div style={{ display: 'flex' }}>
        {project?.metadata?.siteOwnerType && (
          <div className={styles.projectMoreInfo}>
            <div className={styles.infoTitle}>
              {t('manageProjects:siteOwnership')}
            </div>
            {project?.metadata?.siteOwnerType && (
              <div className={styles.infoText}>
                {ownerTypes.map((ownerType: any, index: any) => {
                  return (
                    <React.Fragment key={ownerType}>
                      {`${ownerType}`}
                      {index === ownerTypes.length - 2 ? (
                        <> {t('manageProjects:and')} </>
                      ) : index === ownerTypes.length - 1 ? (
                        '.'
                      ) : (
                        ', '
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            )}
            {project?.metadata?.siteOwnerName ||
            project?.metadata?.acquisitionYear ? (
              <div className={styles.infoText}>
                {project?.metadata?.siteOwnerName}{' '}
                {project?.metadata?.siteOwnerName &&
                project?.metadata?.acquisitionYear ? (
                  <> {t('manageProjects:since')} </>
                ) : (
                  <></>
                )}
                {!project?.metadata?.siteOwnerName &&
                project?.metadata?.acquisitionYear ? (
                  <> {t('manageProjects:Since')} </>
                ) : (
                  <></>
                )}
                {project?.metadata?.acquisitionYear}
              </div>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>

      {project?.metadata?.landOwnershipType && (
        <div style={{ display: 'flex' }}>
          <div className={styles.projectMoreInfo}>
            <div className={styles.infoTitle}>
              {t('manageProjects:siteOwnership')}
            </div>
            {project?.metadata?.landOwnershipType && (
              <div className={styles.infoText}>
                {ownerTypes.map((ownerType: any, index: any) => {
                  return (
                    <React.Fragment key={ownerType}>
                      {t(`manageProjects:${ownerType}`)}
                      {index === ownerTypes.length - 2 ? (
                        <> {t('manageProjects:and')} </>
                      ) : index === ownerTypes.length - 1 ? (
                        '.'
                      ) : (
                        ', '
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            )}
            {project?.metadata?.siteOwnerName ||
            project?.metadata?.acquisitionYear ? (
              <div className={styles.infoText}>
                {project?.metadata?.siteOwnerName}
                {project?.metadata?.siteOwnerName &&
                project?.metadata?.acquisitionYear ? (
                  <> {t('manageProjects:since')} </>
                ) : (
                  <></>
                )}
                {!project?.metadata?.siteOwnerName &&
                project?.metadata?.acquisitionYear ? (
                  <> {t('manageProjects:Since')} </>
                ) : (
                  <></>
                )}{' '}
                {project?.metadata?.acquisitionYear}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      )}

      {project && project.metadata && project.metadata.degradationCause && (
        <div className={styles.projectMoreInfo}>
          <div className={styles.infoTitle}>
            {t('manageProjects:causeOfDegradation')}
          </div>
          <div className={styles.infoText}>
            {project.metadata.degradationCause}
          </div>
        </div>
      )}

      {project && project.metadata && project.metadata.motivation && (
        <div className={styles.projectMoreInfo}>
          <div className={styles.infoTitle}>
            {t('manageProjects:whyThisSite')}
          </div>
          <div className={styles.infoText}>{project.metadata.motivation}</div>
        </div>
      )}

      {project && project.metadata && project.metadata.longTermPlan && (
        <div className={styles.projectMoreInfo}>
          <div className={styles.infoTitle}>
            {t('manageProjects:longTermProtection')}
          </div>
          <div className={styles.infoText}>{project.metadata.longTermPlan}</div>
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
                <a
                  className={styles.infoTextButton}
                  target="_blank"
                  rel="noopener noreferrer"
                  href={getPDFFile('projectCertificate', certificate.pdf)}
                >
                  {t('common:view')}
                </a>
              </div>
            );
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
              <div
                key={expense.id}
                className={styles.infoText}
                style={{ justifyContent: 'normal' }}
              >
                <span>{expense.year}</span>
                <div
                  style={{
                    marginLeft: '6px',
                    display: 'flex',
                    flexDirection: 'row',
                    position: 'relative',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: '#F2F2F7',
                      width: calculatePercentage(expense.amount),
                      height: '20px',
                      position: 'absolute',
                      zIndex: 1,
                    }}
                  ></div>

                  <span style={{ flexGrow: 1, textAlign: 'center', zIndex: 2 }}>
                    {getFormatedCurrency(i18n.language, 'EUR', expense.amount)}
                  </span>

                  <a
                    className={styles.infoTextButton}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={getPDFFile('projectExpense', expense.pdf)}
                    style={{ zIndex: 2 }}
                  >
                    {t('common:view')}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  ) : (
    <></>
  );
}

export default ProjectInfo;
