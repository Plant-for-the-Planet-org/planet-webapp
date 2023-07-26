import { useTranslation } from 'next-i18next';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import myForestStyles from '../../styles/MyForest.module.scss';
import TreeCounter from '../../../../common/TreeCounter/TreeCounter';
import { EditTargetSvg } from '../../../../../../public/assets/images/ProfilePageIcons';
import AddTargetModal from '../../../Profile/components/AddTargetModal';
import ContributedProjectList from './ContributedProjectList';
import { ReactElement } from 'react';
import {
  Contributions,
  TreeContributedProjectListProps,
} from '../../../../common/types/contribution';

const TreeContributedProjectList = ({
  contribution,
  userprofile,
  authenticatedType,
  handleFetchNextPage,
}: TreeContributedProjectListProps): ReactElement => {
  const { t } = useTranslation(['me']);
  const [isAddTargetModalOpen, setIsAddTargetModalOpen] = useState(false);
  const [restorationProject, setRestorationProject] = useState<Contributions[]>(
    []
  );
  const [isLoadButtonActive, setIsLoadButtonActive] = useState(true);

  const handleAddTargetModalOpen = (): void => {
    setIsAddTargetModalOpen(true);
  };

  const handleAddTargetModalClose = (): void => {
    setIsAddTargetModalOpen(false);
  };

  useEffect(() => {
    const data: Contributions[] = [];
    const _fetchProjectlist = () => {
      const _fetchTreePlantedProjects = contribution.map((singlePageData) => {
        if (singlePageData?.nextCursor === undefined)
          setIsLoadButtonActive(false);
        return singlePageData?.data.filter((singleProject: Contributions) => {
          if (
            singleProject.purpose === 'trees' ||
            singleProject.purpose === 'bouquet'
          )
            return singleProject;
        });
      });

      if (_fetchTreePlantedProjects) {
        _fetchTreePlantedProjects.map((singleProject) => {
          data.push(singleProject);
        });
        setRestorationProject(data);
      }
    };
    if (contribution) _fetchProjectlist();
  }, [contribution]);

  return (
    <div className={myForestStyles.mainContainer}>
      <div className={myForestStyles.treeCounterContainer}>
        <div className={myForestStyles.treeCounter}>
          {' '}
          {userprofile && (
            <TreeCounter
              handleAddTargetModalOpen={() => {
                setIsAddTargetModalOpen(true);
              }}
              authenticatedType={authenticatedType}
              target={userprofile?.score?.target}
              planted={
                userprofile?.type === 'tpo'
                  ? userprofile?.score.personal
                  : userprofile?.score.personal + userprofile?.score.received
              }
            />
          )}
          <AddTargetModal
            addTargetModalOpen={isAddTargetModalOpen}
            handleAddTargetModalClose={handleAddTargetModalClose}
          />
        </div>
      </div>
      <div className={myForestStyles.donationListMainContainer}>
        <div className={myForestStyles.editButtonContainer}>
          <Button
            variant="contained"
            startIcon={<EditTargetSvg />}
            onClick={handleAddTargetModalOpen}
            sx={{
              width: '138px',
              height: '34px',
              backgroundColor: '#219653',
              padding: '0px 0px',
            }}
          >
            {t('me:editTarget')}
          </Button>
        </div>
        <div className={myForestStyles.text}>
          {t('me:treesPlantedAndAreaRestored')}
          <p className={myForestStyles.hrLine} />
        </div>

        <ContributedProjectList
          isConservedButtonActive={undefined}
          contributionProjectList={restorationProject}
        />
        {isLoadButtonActive && (
          <div className={myForestStyles.loadProjectButtonContainer}>
            <Button
              style={{ maxWidth: 'fit-content' }}
              variant="contained"
              onClick={handleFetchNextPage}
            >
              {t('me:loadProjects')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TreeContributedProjectList;
