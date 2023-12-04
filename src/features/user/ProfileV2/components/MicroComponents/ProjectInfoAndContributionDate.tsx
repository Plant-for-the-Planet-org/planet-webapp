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
}

const ProjectInfoAndContributionDate = ({
  projectName,
  countryName,
  tpoName,
  giftSenderName,
  contributionDate,
}: ProjectInfoAndContributionDateProps) => {
  const { t } = useTranslation(['me']);
  return (
    <div className={myForestStyles.projectDetail}>
      <div className={myForestStyles.projectDetailMain}>
        <div className={myForestStyles.projectName}>
          {projectName ? projectName : t('me:registeredTree')}
        </div>

        {tpoName || countryName ? (
          <div className={myForestStyles.sepratorContainer}>
            <div>{t('country:' + countryName)}</div>
            <div className={myForestStyles.dotSeprator}>.</div>
            <div className={myForestStyles.tpoName}>{tpoName}</div>
          </div>
        ) : (
          <></>
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
          {format(contributionDate, 'MMM dd, yyyy', {
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
