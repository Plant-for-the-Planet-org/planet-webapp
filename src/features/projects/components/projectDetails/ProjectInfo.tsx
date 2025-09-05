import type { ReactElement } from 'react';
import type {
  ConservationProjectExtended,
  TreeProjectExtended,
} from '@planet-sdk/common/build/types/project/extended';

import { useEffect, useState, Fragment } from 'react';
import styles from './../../styles/ProjectDetails.module.scss';
import { useLocale, useTranslations } from 'next-intl';
import { getPDFFile } from '../../../../utils/getImageURL';
import getFormatedCurrency from '../../../../utils/countryCurrency/getFormattedCurrency';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import InfoIcon from '../../../../../public/assets/images/icons/manageProjects/Info';

interface Props {
  project: TreeProjectExtended | ConservationProjectExtended;
}

function ProjectInfo({ project }: Props): ReactElement {
  const tCommon = useTranslations('Common');
  const tManageProjects = useTranslations('ManageProjects');
  const locale = useLocale();

  const seasons = [
    { id: 0, title: tCommon('january') },
    { id: 1, title: tCommon('february') },
    { id: 2, title: tCommon('march') },
    { id: 3, title: tCommon('april') },
    { id: 4, title: tCommon('may') },
    { id: 5, title: tCommon('june') },
    { id: 6, title: tCommon('july') },
    { id: 7, title: tCommon('august') },
    { id: 8, title: tCommon('september') },
    { id: 9, title: tCommon('october') },
    { id: 10, title: tCommon('november') },
    { id: 11, title: tCommon('december') },
  ];

  const siteOwners = [
    {
      id: 1,
      title: tManageProjects('siteOwnerPrivate'),
      value: 'private',
    },
    {
      id: 2,
      title: tManageProjects('siteOwnerPublic'),
      value: 'public-property',
    },
    {
      id: 3,
      title: tManageProjects('siteOwnerSmallHolding'),
      value: 'smallholding',
    },
    {
      id: 4,
      title: tManageProjects('siteOwnerCommunal'),
      value: 'communal-land',
    },
    {
      id: 5,
      title: tManageProjects('siteOwnerOwned'),
      value: 'owned-by-owner',
    },
    {
      id: 6,
      title: tManageProjects('siteOwnerOther'),
      value: 'other',
    },
  ];
  const [ownerTypes, setOwnerTypes] = useState<string[]>([]);
  useEffect(() => {
    if (
      project.purpose === 'trees' &&
      project.metadata.siteOwnerType &&
      project.metadata.siteOwnerType.length > 0
    ) {
      const updatedSiteOwners: string[] = [];
      const { siteOwnerType } = project.metadata;

      for (let i = 0; i < siteOwnerType.length; i++) {
        const translatedOwnerType = siteOwners.find(
          (element) => element.value === siteOwnerType[i]
        );
        if (translatedOwnerType) {
          updatedSiteOwners.push(translatedOwnerType.title);
        }
      }

      setOwnerTypes(updatedSiteOwners);
    }
  }, [locale]);

  useEffect(() => {
    if (
      project.purpose === 'conservation' &&
      project.metadata.landOwnershipType &&
      project.metadata.landOwnershipType.length > 0
    ) {
      const updatedSiteOwners = [];
      const { landOwnershipType } = project.metadata;

      for (let i = 0; i < landOwnershipType.length; i++) {
        const translatedOwnerType = siteOwners.find(
          (element) => element.value === landOwnershipType[i]
        );
        if (translatedOwnerType) {
          updatedSiteOwners.push(translatedOwnerType.title);
        }
      }

      setOwnerTypes(updatedSiteOwners);
    }
  }, [locale]);

  const expenseAmount = project.expenses.map((expense) => expense.amount);
  const calculatePercentage = (amount: number) => {
    const maxAmount = Math.max(...expenseAmount);
    const percentage = (amount / maxAmount) * 100;
    return `${percentage}%`;
  };

  const addZeroToDate = (val: string) => {
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

  return (
    <div className={styles.projectInfoContainer}>
      <div className={styles.projectMoreInfoHalfContainer}>
        {project.purpose === 'trees' &&
          project.metadata.yearAbandoned !== null &&
          project.metadata.yearAbandoned !== 0 && (
            <div className={styles.projectMoreInfoHalf}>
              <div className={styles.infoTitle}>
                {tManageProjects('abandonment')}
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
                      <p>{tManageProjects('yearAbandonedInfo')}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.infoText}>
                {tCommon('approx')} {project.metadata.yearAbandoned}
              </div>
            </div>
          )}
        {project.purpose === 'trees' &&
          project.metadata.firstTreePlanted !== null && (
            <div className={styles.projectMoreInfoHalf}>
              <div className={styles.infoTitle}>
                {tManageProjects('labelRestorationStarted')}
              </div>
              <div className={styles.infoText}>
                {formatDate(
                  project.metadata.firstTreePlanted.split('-')[1].length ===
                    1 ||
                    project.metadata.firstTreePlanted.split('-')[2].length === 1
                    ? addZeroToDate(project.metadata.firstTreePlanted)
                    : project.metadata.firstTreePlanted
                )}
              </div>
            </div>
          )}

        {project.purpose === 'trees' &&
          project.metadata.plantingDensity !== null && (
            <div className={styles.projectMoreInfoHalf}>
              <div className={styles.infoTitle}>
                {tManageProjects('plantingDensity')}
              </div>
              <div className={styles.infoText}>
                {project.metadata.plantingDensity}
                {project.metadata.maxPlantingDensity !== null
                  ? `-${project.metadata.maxPlantingDensity} ${tManageProjects(
                      'treePerHa'
                    )}`
                  : ` ${tManageProjects('treePerHa')}`}
              </div>
            </div>
          )}

        {project.metadata.employeesCount !== null &&
          project.metadata.employeesCount !== 0 && (
            <div className={styles.projectMoreInfoHalf}>
              <div className={styles.infoTitle}>
                {tManageProjects('employees')}
              </div>
              <div className={styles.infoText}>
                {project.metadata.employeesCount}
              </div>
            </div>
          )}
      </div>

      {project.purpose === 'conservation' &&
        project.metadata.activitySeasons !== null &&
        project.metadata.activitySeasons.length > 0 && (
          <div className={styles.projectMoreInfo}>
            <div className={styles.infoTitle}>
              {tManageProjects('protectionSeasons')}
            </div>
            <div className={styles.infoText}>
              {project.metadata.activitySeasons.map(
                (season, index, activitySeasons) => {
                  return (
                    <Fragment key={seasons[season - 1].title}>
                      {seasons[season - 1].title}
                      {index === activitySeasons.length - 2 ? (
                        <> {tManageProjects('and')} </>
                      ) : index === activitySeasons.length - 1 ? (
                        '.'
                      ) : (
                        ', '
                      )}
                    </Fragment>
                  );
                }
              )}
            </div>
          </div>
        )}

      {project.purpose === 'trees' &&
        project.metadata.plantingSeasons !== null &&
        project.metadata.plantingSeasons.length > 0 && (
          <div className={styles.projectMoreInfo}>
            <div className={styles.infoTitle}>
              {tManageProjects('labelRestorationSeasons')}
            </div>
            <div className={styles.infoText}>
              {project.metadata.plantingSeasons.map(
                (season, index, plantingSeasons) => {
                  return (
                    <Fragment key={seasons[season - 1].title}>
                      {seasons[season - 1].title}
                      {index === plantingSeasons.length - 2 ? (
                        <> {tManageProjects('and')} </>
                      ) : index === plantingSeasons.length - 1 ? (
                        '.'
                      ) : (
                        ', '
                      )}
                    </Fragment>
                  );
                }
              )}
            </div>
          </div>
        )}

      {project.metadata.mainInterventions !== null &&
        project.metadata.mainInterventions.length > 0 && (
          <div className={styles.projectMoreInfo}>
            <div className={styles.infoTitle}>
              {tManageProjects('labelMainInterventions')}
            </div>
            <div className={styles.infoText}>
              {project.metadata.mainInterventions
                .map((intervention) =>
                  tManageProjects(`interventionTypes.${intervention}`)
                )
                .join(', ')}
            </div>
          </div>
        )}

      {project.metadata.mainChallenge !== null && (
        <div className={styles.projectMoreInfo}>
          <div className={styles.infoTitle}>
            {tManageProjects('mainChallenge')}
          </div>
          <div className={styles.infoText}>
            {project.metadata.mainChallenge}
          </div>
        </div>
      )}

      {project.purpose === 'trees' &&
        project.metadata.siteOwnerType !== null && (
          <div style={{ display: 'flex' }}>
            <div className={styles.projectMoreInfo}>
              <div className={styles.infoTitle}>
                {tManageProjects('siteOwnership')}
              </div>
              <div className={styles.infoText}>
                {ownerTypes.map((ownerType, index) => {
                  return (
                    <Fragment key={ownerType}>
                      {ownerType}
                      {index === ownerTypes.length - 2 ? (
                        <> {tManageProjects('and')} </>
                      ) : index === ownerTypes.length - 1 ? (
                        '.'
                      ) : (
                        ', '
                      )}
                    </Fragment>
                  );
                })}
              </div>
              {/* TODO - cleanup */}
              {project.metadata.siteOwnerName !== null ||
              project.metadata.acquisitionYear !== null ? (
                <div className={styles.infoText}>
                  {project.metadata.siteOwnerName}{' '}
                  {project.metadata.acquisitionYear !== null && (
                    <>
                      {project.metadata.siteOwnerName === null ? (
                        <> {tManageProjects('Since')} </>
                      ) : (
                        <> {tManageProjects('since')} </>
                      )}{' '}
                      {project.metadata.acquisitionYear}
                    </>
                  )}
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        )}

      {project.purpose === 'conservation' &&
        project.metadata.landOwnershipType !== null && (
          <div style={{ display: 'flex' }}>
            <div className={styles.projectMoreInfo}>
              <div className={styles.infoTitle}>
                {tManageProjects('siteOwnership')}
              </div>
              <div className={styles.infoText}>
                {ownerTypes.map((ownerType, index) => {
                  return (
                    <Fragment key={ownerType}>
                      {ownerType}
                      {index === ownerTypes.length - 2 ? (
                        <> {tManageProjects('and')} </>
                      ) : index === ownerTypes.length - 1 ? (
                        '.'
                      ) : (
                        ', '
                      )}
                    </Fragment>
                  );
                })}
              </div>
              {project.metadata.siteOwnerName !== null ||
              project.metadata.acquisitionYear !== null ? (
                <div className={styles.infoText}>
                  {project.metadata.siteOwnerName}
                  {project.metadata.acquisitionYear !== null && (
                    <>
                      {project.metadata.siteOwnerName ? (
                        <> {tManageProjects('Since')} </>
                      ) : (
                        <> {tManageProjects('since')} </>
                      )}{' '}
                      {project.metadata.acquisitionYear}
                    </>
                  )}
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        )}

      {project.purpose === 'trees' &&
        project.metadata.degradationCause !== null && (
          <div className={styles.projectMoreInfo}>
            <div className={styles.infoTitle}>
              {tManageProjects('causeOfDegradation')}
            </div>
            <div className={styles.infoText}>
              {project.metadata.degradationCause}
            </div>
          </div>
        )}

      {project.metadata.motivation !== null && (
        <div className={styles.projectMoreInfo}>
          <div className={styles.infoTitle}>
            {tManageProjects('whyThisSite')}
          </div>
          <div className={styles.infoText}>{project.metadata.motivation}</div>
        </div>
      )}

      {project.metadata.longTermPlan !== null && (
        <div className={styles.projectMoreInfo}>
          <div className={styles.infoTitle}>
            {tManageProjects('longTermProtection')}
          </div>
          <div className={styles.infoText}>{project.metadata.longTermPlan}</div>
        </div>
      )}

      {project.certificates.length > 0 && (
        <div className={styles.projectMoreInfo}>
          <div className={styles.infoTitle}>
            {tManageProjects('externalCertifications')}
          </div>

          {project.certificates.map((certificate) => {
            return (
              <div key={certificate.id} className={styles.infoText}>
                {certificate.certifierName}
                <a
                  className={styles.infoTextButton}
                  target="_blank"
                  rel="noopener noreferrer"
                  href={getPDFFile('projectCertificate', certificate.pdf)}
                >
                  {tCommon('view')}
                </a>
              </div>
            );
          })}
        </div>
      )}

      {project.expenses.length > 0 && (
        <div className={styles.projectMoreInfo}>
          <div className={styles.infoTitle}>
            {tManageProjects('projectSpendingFinancial')}
          </div>

          {project.expenses.map((expense) => {
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
                    {getFormatedCurrency(locale, 'EUR', expense.amount)}
                  </span>

                  <a
                    className={styles.infoTextButton}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={getPDFFile('projectExpense', expense.pdf)}
                    style={{ zIndex: 2 }}
                  >
                    {tCommon('view')}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProjectInfo;
