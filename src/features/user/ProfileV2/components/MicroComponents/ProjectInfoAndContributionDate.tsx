import myForestStyles from '../../styles/MyForest.module.scss';
import format from 'date-fns/format';
import { useTranslation } from 'next-i18next';
import { localeMapForDate } from '../../../../../utils/language/getLanguageName';

interface ProjectInfoAndContributionDateProps {
  projectName: string | null;
  countryName: string;
  tpoName: string;
  giftSenderName: string;
  contributionDate: string | number | Date;
  contributionType: string | boolean;
  quantity: number | null;
}

const ProjectInfoAndContributionDate = ({
  projectName,
  countryName,
  tpoName,
  giftSenderName,
  contributionDate,
  contributionType,
  quantity,
}: ProjectInfoAndContributionDateProps) => {
  const { t } = useTranslation(['me']);
  return (
    <div className={myForestStyles.projectDetail}>
      <div className={myForestStyles.projectDetailMain}>
        <div className={myForestStyles.projectName}>{projectName}</div>

        {tpoName || countryName ? (
          <div className={myForestStyles.sepratorContainer}>
            <div>{t('country:' + countryName)}</div>
            <div
              className={myForestStyles.dotSeprator}
              style={{ position: 'relative' }}
            >
              <div style={{ position: 'absolute' }}>.</div>
            </div>
            <div className={myForestStyles.tpoName}>{tpoName}</div>
          </div>
        ) : (
          <time className={myForestStyles.treeCount}>
            {contributionType === 'planting' && //for register  tree
              t('me:registeredPlantedTrees', {
                count: parseInt(`${quantity}`) || 0,
              })}
          </time>
        )}

        {giftSenderName ? (
          <div>
            {t('me:receivedFrom', {
              name: `${giftSenderName}`,
            })}
          </div>
        ) : (
          <></>
        )}
      </div>

      {contributionDate ? (
        <div className={myForestStyles.plantingDate}>
          {format(contributionDate, 'PP', {
            locale: localeMapForDate[localStorage.getItem('language') || 'en'],
          })}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ProjectInfoAndContributionDate;
