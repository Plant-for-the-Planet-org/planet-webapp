import { ReactElement, useEffect, useState } from 'react';
import { useMyForest } from '../../../common/Layout/MyForestContext';
import ListHeader from './ListHeader';
import styles from './MyContributions.module.scss';
import ProjectItemCard, { ProjectItemCardProps } from './ProjectItemCard';
import RegistrationItemCard, {
  RegistrationItemCardProps,
} from './RegistrationItemCard';
import NoContributions from '../CommunityContributions/NoContributions';
import { ProfileV2Props } from '../../../common/types/profile';

const MyContributions = ({ profilePageType, userProfile }: ProfileV2Props) => {
  const { contributionsMap, projectListResult } = useMyForest();
  const [contributionListItems, setContributionsListItems] = useState<
    (
      | ReactElement<RegistrationItemCardProps>
      | ReactElement<ProjectItemCardProps>
    )[]
  >([]);

  useEffect(() => {
    if (contributionsMap && projectListResult) {
      const items: (
        | ReactElement<RegistrationItemCardProps>
        | ReactElement<ProjectItemCardProps>
      )[] = [];
      contributionsMap.forEach((item, key) => {
        if (item.type === 'registration') {
          items.push(
            <RegistrationItemCard key={key} contributionDetails={item} />
          );
        } else {
          items.push(
            <ProjectItemCard
              key={key}
              contributionDetails={item}
              project={projectListResult[key]}
              profilePageType={profilePageType}
              {...(profilePageType === 'public'
                ? { supportedTreecounter: userProfile.slug }
                : {})}
            />
          );
        }
      });
      setContributionsListItems(items);
    }
  }, [contributionsMap, projectListResult]);

  return (
    <div className={styles.myContributions}>
      <ListHeader
        profilePageType={profilePageType}
        displayName={
          userProfile.type === 'individual'
            ? userProfile.displayName.split(' ').slice(0, 1)[0]
            : userProfile.displayName
        }
      />
      {contributionListItems.length > 0 ? (
        <div className={styles.myContributionsList}>
          {contributionListItems}
        </div>
      ) : (
        <NoContributions
          {...(profilePageType === 'private'
            ? { profilePageType: 'private', userProfile: userProfile }
            : { profilePageType: 'public', userProfile: userProfile })}
        />
      )}
    </div>
  );
};

export default MyContributions;
