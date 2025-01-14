import type { APIError, User } from '@planet-sdk/common';
import type { SetState } from '../../../common/types/common';

import { Modal } from '@mui/material';
import styles from './ForestProgress.module.scss';
import { useContext, useEffect } from 'react';
import { useMyForest } from '../../../common/Layout/MyForestContext';
import { putAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { useTenant } from '../../../common/Layout/TenantContext';
import { handleError } from '@planet-sdk/common';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { useTranslations } from 'next-intl';
import CrossIcon from '../../../../../public/assets/images/icons/manageProjects/Cross';
import TargetFormInput from './TargetFormInput';
import { useState } from 'react';

interface TargetsModalProps {
  open: boolean;
  setOpen: SetState<boolean>;
  treeTarget: number;
  restoreTarget: number;
  conservTarget: number;
}

const TargetsModal = ({
  open,
  setOpen,
  treeTarget,
  restoreTarget,
  conservTarget,
}: TargetsModalProps) => {
  const { setUserInfo } = useMyForest();
  const { contextLoaded, token, logoutUser, setRefetchUserData } =
    useUserProps();
  const { setErrors } = useContext(ErrorHandlingContext);
  const tProfile = useTranslations('Profile.progressBar');
  const { tenantConfig } = useTenant();
  // states to manage modal
  const [isTargetModalLoading, setIsTargetModalLoading] = useState(false);
  const [treesPlantedTargetLocal, setTreesPlantedTargetLocal] = useState(0);
  const [areaRestoredTargetLocal, setAreaRestoredTargetLocal] = useState(0);
  const [areaConservedTargetLocal, setAreaConservedTargetLocal] = useState(0);
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
    setTreesPlantedTargetLocal(treeTarget);
    setAreaRestoredTargetLocal(restoreTarget);
    setAreaConservedTargetLocal(conservTarget);
  }, [open]);

  const handleTargets = async () => {
    setIsTargetModalLoading(true);
    if (contextLoaded && token && open && !isTargetModalLoading) {
      const bodyToSend = {
        targets: {
          treesDonated: isTreesPlantedTargetActive
            ? treesPlantedTargetLocal
            : 0,
          areaRestored: isRestoredAreaTargetActive
            ? areaRestoredTargetLocal
            : 0,
          areaConserved: isConservedAreaTargetActive
            ? areaConservedTargetLocal
            : 0,
        },
      };
      try {
        const res = await putAuthenticatedRequest<User>({
          tenant: tenantConfig?.id,
          url: `/app/profile`,
          data: bodyToSend,
          token,
          logoutUser,
        });
        const newUserInfo = {
          profileId: res.id,
          slug: res.slug,
          targets: {
            treesDonated: res.scores.treesDonated.target ?? 0,
            areaConserved: res.scores.areaConserved.target ?? 0,
            areaRestored: res.scores.areaRestored.target ?? 0,
          },
        };
        setRefetchUserData(true);
        if (newUserInfo !== undefined) {
          setUserInfo(newUserInfo);
          setTreesPlantedTargetLocal(newUserInfo.targets.treesDonated ?? 0);
          setAreaRestoredTargetLocal(newUserInfo.targets.areaRestored ?? 0);
          setAreaConservedTargetLocal(newUserInfo.targets.areaConserved ?? 0);
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
            localTarget={treesPlantedTargetLocal}
            setLocalTarget={setTreesPlantedTargetLocal}
            checked={isTreesPlantedTargetActive}
            setChecked={setIsTreesPlantedTargetActive}
          />
          <TargetFormInput
            dataType={'areaRestored'}
            localTarget={areaRestoredTargetLocal}
            setLocalTarget={setAreaRestoredTargetLocal}
            checked={isRestoredAreaTargetActive}
            setChecked={setIsRestoredAreaTargetActive}
          />
          <TargetFormInput
            dataType={'areaConserved'}
            localTarget={areaConservedTargetLocal}
            setLocalTarget={setAreaConservedTargetLocal}
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
