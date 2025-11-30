import type { ReactElement } from 'react';
import type { ProjectItemCardProps } from './ProjectItemCard';
import type { RegistrationItemCardProps } from './RegistrationItemCard';
import type { ProfileV2Props } from '../../../common/types/profile';

import { useEffect, useState } from 'react';
import { useMyForestStore } from '../../../../stores/myForestStore';
import ListHeader from './ListHeader';
import styles from './MyContributions.module.scss';
import ProjectItemCard from './ProjectItemCard';
import RegistrationItemCard from './RegistrationItemCard';
import NoContributions from '../CommunityContributions/NoContributions';

const MyContributions = ({ profilePageType, userProfile }: ProfileV2Props) => {
  const contributionsMap = useMyForestStore((state) => state.contributionsMap);
  const projectListResult = useMyForestStore(
    (state) => state.projectListResult
  );
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
            <RegistrationItemCard key={key} registrationDetails={item} />
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
