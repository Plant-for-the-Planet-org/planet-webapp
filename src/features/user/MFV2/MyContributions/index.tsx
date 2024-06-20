import { ReactElement, useEffect, useState } from 'react';
import { useMyForestV2 } from '../../../common/Layout/MyForestContextV2';
import ListHeader from './ListHeader';
import styles from './MyContributions.module.scss';
import ProjectItemCard, { ProjectItemCardProps } from './ProjectItemCard';
import RegistrationItemCard, {
  RegistrationItemCardProps,
} from './RegistrationItemCard';

interface Props {
  profilePageType: 'private' | 'public';
  displayName: string;
  supportedTreecounter?: string;
}

const MyContributions = ({
  profilePageType,
  displayName,
  supportedTreecounter,
}: Props) => {
  const { contributionsMap, projectListResult } = useMyForestV2();
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
              supportedTreecounter={supportedTreecounter}
            />
          );
        }
      });
      setContributionsListItems(items);
    }
  }, [contributionsMap, projectListResult]);

  return (
    <div className={styles.myContributions}>
      <ListHeader profilePageType={profilePageType} displayName={displayName} />
      <div className={styles.myContributionsList}>{contributionListItems}</div>
    </div>
  );
};

export default MyContributions;
