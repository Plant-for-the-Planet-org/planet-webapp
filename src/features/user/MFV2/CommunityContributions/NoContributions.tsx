import { useTranslations } from 'next-intl';
import {
  NoContributionsIcon,
  SupportUserIcon,
} from '../../../../../public/assets/images/icons/ProfilePageV2Icons';
import { ProfileV2Props } from '../../../common/types/profile';
import WebappButton from '../../../common/WebappButton';
import styles from './communityContributions.module.scss';

const NoContributions = ({ profilePageType, userProfile }: ProfileV2Props) => {
  const t = useTranslations('Profile');
  return (
    <div className={styles.noContributionsContainer}>
      <NoContributionsIcon />
      {profilePageType === 'private' ? (
        <span className={styles.noContributionsMessage}>
          {t('communityContributions.noContributionPrivateProfileText')}
        </span>
      ) : (
        <>
          <span className={styles.noContributionsMessage}>
            {t('communityContributions.noContributionPublicProfileText', {
              name: userProfile?.displayName.split(' ')[0],
            })}
          </span>
          <WebappButton
            icon={<SupportUserIcon />}
            text={
              userProfile.type === 'individual'
                ? t('feature.supportUserTextIndividual', {
                    username: userProfile?.displayName.split(' ')[0],
                  })
                : t('feature.supportUserTextGeneric')
            }
            variant="primary"
            elementType="link"
            href={`/s/${userProfile?.slug}`}
          />
        </>
      )}
    </div>
  );
};

export default NoContributions;
