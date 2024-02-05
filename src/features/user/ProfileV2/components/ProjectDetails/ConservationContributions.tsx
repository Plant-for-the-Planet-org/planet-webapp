import myForestStyles from '../../styles/MyForest.module.scss';
import { useTranslation } from 'next-i18next';
import ContributedProjectList from './ContributedProjectList';
import { ReactElement } from 'react';
import { TreeContributedProjectListProps } from '../../../../common/types/myForest';
import { useMyForest } from '../../../../common/Layout/MyForestContext';

type AreaConservedProjectListProps = Omit<
  TreeContributedProjectListProps,
  'restoredAreaUnit'
>;

const ConservationContributions = ({
  userProfile,
  hasNextPage,
  handleFetchNextPage,
}: AreaConservedProjectListProps): ReactElement => {
  const { t, ready } = useTranslation(['me']);
  const { conservationContribution } = useMyForest();

  return ready ? (
    <div className={myForestStyles.areaConservedMainContainer}>
      <div className={myForestStyles.textContainer}>
        <div className={myForestStyles.conservedAreaText}>
          <div>{t('me:areaConserved')}</div>
          <div className={myForestStyles.hrLine} />
        </div>
      </div>
      <div className={myForestStyles.areaConservedContainer}>
        <ContributedProjectList
          userProfile={userProfile}
          hasNextPage={hasNextPage}
          contributionProjectList={conservationContribution?.pages}
          handleFetchNextPage={() => handleFetchNextPage}
        />
      </div>
    </div>
  ) : (
    <></>
  );
};

export default ConservationContributions;
