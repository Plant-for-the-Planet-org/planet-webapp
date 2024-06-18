import { Modal } from '@mui/material';
import styles from './ForestProgress.module.scss';
import { useContext, useEffect } from 'react';
import { useMyForestV2 } from '../../../common/Layout/MyForestContextV2';
import { putAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { useTenant } from '../../../common/Layout/TenantContext';
import { handleError, APIError, User } from '@planet-sdk/common';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { SetState } from '../../../common/types/common';
import { useTranslations } from 'next-intl';
import CrossIcon from '../../../../../public/assets/images/icons/manageProjects/Cross';
import TargetFormInput from './TargetFormInput';
import { useState } from 'react';

interface TargetsModalProps {
  open: boolean;
  setOpen: SetState<boolean>;
}

const TargetsModal = ({ open, setOpen }: TargetsModalProps) => {
  const {
    setIsTargetModalLoading,
    isTargetModalLoading,
    treeTarget,
    restoreTarget,
    conservTarget,
    setUserInfo,
  } = useMyForestV2();
  const { contextLoaded, token, logoutUser, setRefetchUserData } =
    useUserProps();
  const { setErrors } = useContext(ErrorHandlingContext);
  const tProfile = useTranslations('Profile.progressBar');
  const { tenantConfig } = useTenant();
  // states to manage modal
  const [treesPlantedTarget, setTreesPlanted] = useState(0);
  const [areaRestoredTarget, setAreaRestoredTarget] = useState(0);
  const [areaConservedTarget, setAreaConservedTarget] = useState(0);
  const [isTreesPlantedTargetActive, setIsTreesPlantedTargetActive] = useState(
    treeTarget > 0
  );
  const [isRestoredAreaTargetActive, setIsRestoredAreaTargetActive] = useState(
    restoreTarget > 0
  );
  const [isConservedAreaTargetActive, setIsConservedAreaTargetActive] =
    useState(conservTarget > 0);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setIsTreesPlantedTargetActive(treeTarget > 0);
    setIsRestoredAreaTargetActive(restoreTarget > 0);
    setIsConservedAreaTargetActive(conservTarget > 0);
    setTreesPlanted(treeTarget);
    setAreaRestoredTarget(restoreTarget);
    setAreaConservedTarget(conservTarget);
  }, [open]);

  const handleTargets = async () => {
    setIsTargetModalLoading(true);
    if (contextLoaded && token && open && !isTargetModalLoading) {
      const bodyToSend = {
        targets: {
          treesDonated: isTreesPlantedTargetActive ? treesPlantedTarget : 0,
          areaRestored: isRestoredAreaTargetActive ? areaRestoredTarget : 0,
          areaConserved: isConservedAreaTargetActive ? areaConservedTarget : 0,
        },
      };
      try {
        const res = await putAuthenticatedRequest<User>(
          tenantConfig?.id,
          `/app/profile`,
          bodyToSend,
          token,
          logoutUser
        );
        const newUserInfo = {
          profileId: res.id,
          slug: res.slug,
          targets: {
            treesDonated: res.targets.treesDonated ?? 0,
            areaConserved: res.targets.areaConserved ?? 0,
            areaRestored: res.targets.areaRestored ?? 0,
          },
        };
        setRefetchUserData(true);
        if (newUserInfo !== undefined) {
          setUserInfo(newUserInfo);
          setTreesPlanted(newUserInfo.targets.treesDonated ?? 0);
          setAreaRestoredTarget(newUserInfo.targets.areaRestored ?? 0);
          setAreaConservedTarget(newUserInfo.targets.areaConserved ?? 0);
          setIsTargetModalLoading(false);
          handleClose();
        }
      } catch (err) {
        handleClose();
        setIsTargetModalLoading(false);
        setErrors(handleError(err as APIError));
      }
    }
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <div className={styles.targetModalMainContainer}>
        <button className={styles.crossIconContainer} onClick={handleClose}>
          <CrossIcon />
        </button>
        <div className={styles.setTargetLabel}>{tProfile('setTargets')}</div>

        <div className={styles.targetModalSubConatiner}>
          <TargetFormInput
            dataType={'treesPlanted'}
            target={treeTarget}
            latestTarget={treesPlantedTarget}
            setLatestTarget={setTreesPlanted}
            checked={isTreesPlantedTargetActive}
            setChecked={setIsTreesPlantedTargetActive}
          />
          <TargetFormInput
            dataType={'areaRestored'}
            target={restoreTarget}
            latestTarget={areaRestoredTarget}
            setLatestTarget={setAreaRestoredTarget}
            checked={isRestoredAreaTargetActive}
            setChecked={setIsRestoredAreaTargetActive}
          />
          <TargetFormInput
            dataType={'areaConserved'}
            target={conservTarget}
            latestTarget={areaConservedTarget}
            setLatestTarget={setAreaConservedTarget}
            checked={isConservedAreaTargetActive}
            setChecked={setIsConservedAreaTargetActive}
          />
        </div>
        <button className={styles.saveButton} onClick={handleTargets}>
          {isTargetModalLoading ? (
            <div className={'spinner'}></div>
          ) : (
            tProfile('save')
          )}
        </button>
      </div>
    </Modal>
  );
};

export default TargetsModal;
