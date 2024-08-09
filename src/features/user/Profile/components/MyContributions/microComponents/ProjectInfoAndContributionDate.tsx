import myForestStyles from '../../../styles/MyForest.module.scss';
import format from 'date-fns/format';
import { useTranslations } from 'next-intl';
import { localeMapForDate } from '../../../../../../utils/language/getLanguageName';

interface ProjectInfoAndContributionDateProps {
  projectName: string | null;
  countryName: string;
  tpoName: string;
  giftSenderName: string;
  contributionDate: number | Date;
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
  const t = useTranslations('Profile');
  const tCountry = useTranslations('Country');
  return (
    <div className={myForestStyles.projectDetail}>
      <div className={myForestStyles.projectDetailMain}>
        <div className={myForestStyles.projectName}>{projectName}</div>

        {tpoName || countryName ? (
          <div className={myForestStyles.sepratorContainer}>
            <div>{tCountry(countryName)}</div>
            <div className={myForestStyles.dotSeprator}>
              <div className={myForestStyles.dot}>.</div>
            </div>
            <div className={myForestStyles.tpoName}>{tpoName}</div>
          </div>
        ) : (
          <time className={myForestStyles.treeCount}>
            {contributionType === 'planting' &&
              Number(quantity) && //for register  tree
              t('myContributions.treeRegistered', {
                count: parseInt(`${quantity}`),
              })}
          </time>
        )}

        {giftSenderName ? (
          <div>
            {t('myContributions.receivedFrom', {
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
