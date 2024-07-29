import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import Button from '@mui/material/Button';
import myForestStyles from '../../../styles/MyForest.module.scss';
import TreeCounter from '../../../../../common/TreeCounter/TreeCounter';
import { EditTargetSvg } from '../../../../../../../public/assets/images/ProfilePageIcons';
import AddTargetModal from './AddTargetModal';
import ContributedProjectList from './ContributedProjectList';
import { ReactElement } from 'react';
import { TreeContributedProjectListProps } from '../../../../../common/types/myForest';
import { useMyForest } from '../../../../../common/Layout/MyForestContext';
import { useRouter } from 'next/router';

const PlantedTreesContributions = ({
  userProfile,
  handleFetchNextPage,
  hasNextPage,
}: TreeContributedProjectListProps): ReactElement => {
  const router = useRouter();
  const t = useTranslations('Profile');
  const locale = useLocale();
  const [isAddTargetModalOpen, setIsAddTargetModalOpen] = useState(false);
  const { treePlantationContribution, additionalInfoRelatedToContributions } =
    useMyForest();
  const handleAddTargetModalOpen = (): void => {
    setIsAddTargetModalOpen(true);
  };
  const handleAddTargetModalClose = (): void => {
    setIsAddTargetModalOpen(false);
  };

  const _checkConditions = () => {
    switch (true) {
      case userProfile?.type === 'tpo' &&
        router.asPath === `/${locale}/profile`: // tpo private profile
        return true;
      case userProfile?.type !== 'tpo' &&
        router.asPath === `/${locale}/profile`: // normal user private profile
        return true;
      case userProfile?.type === 'tpo' &&
        router.asPath !== `/${locale}/profile`: // tpo public profile
        return false;
      case userProfile?.type !== 'tpo' &&
        router.asPath !== `/${locale}/profile`: //  normal user public profile
        return true;
      default:
        return null;
    }
  };

  return (
    <div
      className={
        _checkConditions()
          ? myForestStyles.mainContainer
          : myForestStyles.mainContainerX
      }
    >
      <div className={myForestStyles.treeCounterContainer}>
        <div className={myForestStyles.treeCounter}>
          {' '}
          {userProfile && (
            <TreeCounter
              restoredAreaUnit={
                additionalInfoRelatedToContributions?.squareMeters
                  ? additionalInfoRelatedToContributions?.squareMeters
                  : 0
              }
              handleAddTargetModalOpen={() => {
                setIsAddTargetModalOpen(true);
              }}
              target={userProfile?.score?.target}
              planted={
                userProfile?.score.personal + userProfile?.score.received
              }
            />
          )}
          <AddTargetModal
            addTargetModalOpen={isAddTargetModalOpen}
            handleAddTargetModalClose={handleAddTargetModalClose}
          />
        </div>
      </div>
      <div
        className={
          _checkConditions()
            ? myForestStyles.donationListMainContainer
            : myForestStyles.donationListMainContainerX
        }
      >
        {_checkConditions() && (
          <div className={myForestStyles.donationList}>
            {router.asPath === `/${locale}/profile` ? (
              <div className={myForestStyles.editButtonContainer}>
                <Button
                  variant="contained"
                  startIcon={<EditTargetSvg color="#FFFFFF" />}
                  onClick={handleAddTargetModalOpen}
                  className={myForestStyles.customEditButton}
                >
                  {t('myTreeCounter.editTarget')}
                </Button>
              </div>
            ) : (
              <></>
            )}

            <div className={myForestStyles.text}>
              {t('myContributions.treesPlantedAndAreaRestored')}
              <p className={myForestStyles.hrLine} />
            </div>
            <ContributedProjectList
              userProfile={userProfile}
              hasNextPage={hasNextPage}
              contributionProjectList={treePlantationContribution?.pages}
              handleFetchNextPage={handleFetchNextPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantedTreesContributions;
