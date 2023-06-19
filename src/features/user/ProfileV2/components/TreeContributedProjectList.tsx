import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import Button from '@mui/material/Button';
import myForestStyles from '../styles/MyForest.module.scss';
import TreeCounter from '../../../common/TreeCounter/TreeCounter';
import { EditTargetSvg } from '../../../../../public/assets/images/ProfilePageIcons';
import AddTargetModal from '../../Profile/components/AddTargetModal';
import ContributedProjectList from './ContributedProjectList';

const TreeContributedProjectList = (props) => {
  const { t } = useTranslation(['me']);
  const [isAddTargetModalOpen, setIsAddTargetModalOpen] = useState(false);

  const handleAddTargetModalOpen = () => {
    setIsAddTargetModalOpen(true);
  };

  const handleAddTargetModalClose = () => {
    setIsAddTargetModalOpen(false);
  };
  return (
    <div className={myForestStyles.mainContainer}>
      <div className={myForestStyles.treeCounterContainer}>
        <div className={myForestStyles.treeCounter}>
          {' '}
          {props?.userprofile && (
            <TreeCounter
              handleAddTargetModalOpen={() => {
                setIsAddTargetModalOpen(true);
              }}
              authenticatedType={props.authenticatedType}
              target={props.userprofile?.score?.target}
              planted={
                props.userprofile?.type === 'tpo'
                  ? props.userprofile?.score.personal
                  : props.userprofile?.score.personal +
                    props.userprofile?.score.received
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
        <Button
          variant="contained"
          startIcon={<EditTargetSvg />}
          onClick={handleAddTargetModalOpen}
          sx={{
            width: '126px',
            height: '31px',
            backgroundColor: '#219653',
            padding: '0px 0px',
            fontSize: '14px',
            fontWeight: 'bold',
            position: 'absolute',
            top: '180px',
            left: '465px',
          }}
        >
          {t('me:editTarget')}
        </Button>
        <div className={myForestStyles.text}>
          {t('me:treesPlantedAndAreaRestored')}
          <p className={myForestStyles.hrLine} />
        </div>
        <ContributedProjectList
          isConservedButtonActive={undefined}
          contributionProjectList={props.contribution}
        />
      </div>
    </div>
  );
};

export default TreeContributedProjectList;
