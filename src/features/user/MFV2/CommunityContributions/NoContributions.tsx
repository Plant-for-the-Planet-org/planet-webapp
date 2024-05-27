import { useTranslations } from 'next-intl';
import {
  NoContributionsIcon,
  SupportUserIcon,
} from '../../../../../public/assets/images/icons/ProfilePageV2Icons';
import { ProfileV2Props } from '../../../common/types/profile';
import ProfileCardButton from '../ProfileCard/ProfileCardButton';
import styles from './communityContributions.module.scss';

const NoContributions = ({ profileType, userProfile }: ProfileV2Props) => {
  const isPrivateAccount = profileType === 'private';
  const t = useTranslations('Profile');
  return (
    <div className={styles.noContributionsContainer}>
      <NoContributionsIcon />
      {isPrivateAccount ? (
        <span>Oops! No contributions to show yet</span>
      ) : (
        <>
          <span>Make a donation to support Sophia's efforts</span>
          <ProfileCardButton
            icon={<SupportUserIcon />}
            text={t('feature.supportUserText', {
              username: userProfile?.displayName.split(' ')[0],
            })}
            color={'primary'}
            elementType={'link'}
            href={`/s/${userProfile?.slug}`}
          />
        </>
      )}
    </div>
  );
};

export default NoContributions;
