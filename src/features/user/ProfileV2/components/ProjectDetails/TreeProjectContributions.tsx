import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import Button from '@mui/material/Button';
import myForestStyles from '../../styles/MyForest.module.scss';
import TreeCounter from '../../../../common/TreeCounter/TreeCounter';
import { EditTargetSvg } from '../../../../../../public/assets/images/ProfilePageIcons';
import AddTargetModal from '../userFeatures/AddTargetModal';
import ContributedProjectList from './ContributedProjectList';
import { ReactElement } from 'react';
import { TreeContributedProjectListProps } from '../../../../common/types/myForest';

const TreeProjectContributions = ({
  restoredAreaUnit,
  contribution,
  userProfile,
  handleFetchNextPage,
}: TreeContributedProjectListProps): ReactElement => {
  const { t } = useTranslation(['me']);
  const [isAddTargetModalOpen, setIsAddTargetModalOpen] = useState(false);

  const handleAddTargetModalOpen = (): void => {
    setIsAddTargetModalOpen(true);
  };
  const handleAddTargetModalClose = (): void => {
    setIsAddTargetModalOpen(false);
  };

  return (
    <div className={myForestStyles.mainContainer}>
      <div className={myForestStyles.treeCounterContainer}>
        <div className={myForestStyles.treeCounter}>
          {' '}
          {userProfile && (
            <TreeCounter
              restoredAreaUnit={restoredAreaUnit}
              handleAddTargetModalOpen={() => {
                setIsAddTargetModalOpen(true);
              }}
              target={userProfile?.score?.target}
              planted={
                userProfile?.type === 'tpo'
                  ? userProfile?.score.personal
                  : userProfile?.score.personal + userProfile?.score.received
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
        <div className={myForestStyles.donationList}>
          <div className={myForestStyles.editButtonContainer}>
            <Button
              variant="contained"
              startIcon={<EditTargetSvg color={'#FFFFFF'} />}
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
            contributionProjectList={contribution?.pages}
            handleFetchNextPage={handleFetchNextPage}
          />
        </div>
      </div>
    </div>
  );
};

export default TreeProjectContributions;
