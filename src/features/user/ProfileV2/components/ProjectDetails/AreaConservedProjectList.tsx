import myForestStyles from '../../styles/MyForest.module.scss';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import ContributedProjectList from './ContributedProjectList';
import { ReactElement } from 'react';
import { AreaConservedProjectListProps } from '../../../../common/types/myForest';

const AreaConservedProjectList = ({
  contribution,
  handleFetchNextPage,
}: AreaConservedProjectListProps): ReactElement => {
  const { t, ready } = useTranslation(['me']);
  const [isLoadButtonActive, setIsLoadButtonActive] = useState(false);

  return ready ? (
    <div className={myForestStyles.areaConservedMainContainer}>
      <div className={myForestStyles.textContainer}>
        <div className={myForestStyles.conservedAreaText}>
          <p>{t('me:areaConserved')}</p>
          <p className={myForestStyles.hrLine} />
        </div>
      </div>
      <div className={myForestStyles.areaConservedContainer}>
        <ContributedProjectList
          contributionProjectList={contribution}
          setIsLoadButtonActive={setIsLoadButtonActive}
          isLoadButtonActive={isLoadButtonActive}
          handleFetchNextPage={handleFetchNextPage}
        />
      </div>
    </div>
  ) : (
    <></>
  );
};

export default AreaConservedProjectList;
