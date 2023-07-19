import { useTranslation } from 'next-i18next';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import myForestStyles from '../styles/MyForest.module.scss';
import TreeCounter from '../../../common/TreeCounter/TreeCounter';
import { EditTargetSvg } from '../../../../../public/assets/images/ProfilePageIcons';
import AddTargetModal from '../../Profile/components/AddTargetModal';
import ContributedProjectList from './ContributedProjectList';

const TreeContributedProjectList = ({
  contribution,
  userprofile,
  authenticatedType,
}) => {
  const { t } = useTranslation(['me']);
  const [isAddTargetModalOpen, setIsAddTargetModalOpen] = useState(false);
  const [restorationProject, setRestorationProject] = useState([]);

  const handleAddTargetModalOpen = () => {
    setIsAddTargetModalOpen(true);
  };

  const handleAddTargetModalClose = () => {
    setIsAddTargetModalOpen(false);
  };

  useEffect(() => {
    if (contribution) {
      const _treesPlantedProject = contribution.filter((project) => {
        if (project.purpose === 'trees' || project.purpose === 'bouquet')
          return project;
      });
      setRestorationProject(_treesPlantedProject);
    }
  }, []);
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
      </div>
    </div>
  );
};

export default TreeContributedProjectList;
