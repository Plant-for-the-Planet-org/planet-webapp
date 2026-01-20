import type { APIError, User } from '@planet-sdk/common';
import type { SetState } from '../../../common/types/common';

import { Modal } from '@mui/material';
import styles from './ForestProgress.module.scss';
import { useContext, useEffect } from 'react';
import { handleError } from '@planet-sdk/common';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { useTranslations } from 'next-intl';
import CrossIcon from '../../../../../public/assets/images/icons/manageProjects/Cross';
import TargetFormInput from './TargetFormInput';
import { useState } from 'react';
import { useApi } from '../../../../hooks/useApi';
import {
  useAuthStore,
  useMyForestStore,
  useUserStore,
} from '../../../../stores';
import { transformProfileToForestUserInfo } from '../../../../utils/myForestUtils';

interface TargetsModalProps {
  open: boolean;
  setOpen: SetState<boolean>;
  treeTarget: number;
  restorationTarget: number;
  conservationTarget: number;
}

type ForestProgressTargetApiPayload = {
  targets: {
    treesDonated: number;
    areaRestored: number;
    areaConserved: number;
  };
};

const TargetsModal = ({
  open,
  setOpen,
  treeTarget,
  restorationTarget,
  conservationTarget,
}: TargetsModalProps) => {
  const { setErrors } = useContext(ErrorHandlingContext);
  const { putApiAuthenticated } = useApi();
  const tProfile = useTranslations('Profile.progressBar');
  // states to manage modal
  const [isTargetModalLoading, setIsTargetModalLoading] = useState(false);
  const [treesPlantedTargetLocal, setTreesPlantedTargetLocal] = useState(0);
  const [areaRestoredTargetLocal, setAreaRestoredTargetLocal] = useState(0);
  const [areaConservedTargetLocal, setAreaConservedTargetLocal] = useState(0);
  const [isTreesPlantedTargetActive, setIsTreesPlantedTargetActive] = useState(
    treeTarget > 0
  );
  const [isRestoredAreaTargetActive, setIsRestoredAreaTargetActive] = useState(
    restorationTarget > 0
  );
  const [isConservedAreaTargetActive, setIsConservedAreaTargetActive] =
    useState(conservationTarget > 0);
  //store: state
  const isAuthReady = useAuthStore(
    (state) => state.token !== null && state.isAuthResolved
  );
  //store: action
  const setUserInfo = useMyForestStore((state) => state.setUserInfo);
  const setShouldRefetchUserProfile = useUserStore(
    (state) => state.setShouldRefetchUserProfile
  );

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setIsTreesPlantedTargetActive(treeTarget > 0);
    setIsRestoredAreaTargetActive(restorationTarget > 0);
    setIsConservedAreaTargetActive(conservationTarget > 0);
    setTreesPlantedTargetLocal(treeTarget);
    setAreaRestoredTargetLocal(restorationTarget);
    setAreaConservedTargetLocal(conservationTarget);
  }, [open]);

  const handleTargets = async () => {
    setIsTargetModalLoading(true);
    if (isAuthReady && open && !isTargetModalLoading) {
      const payload: ForestProgressTargetApiPayload = {
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
        const res = await putApiAuthenticated<
          User,
          ForestProgressTargetApiPayload
        >('/app/profile', {
          payload,
        });
        const forestUserInfo = transformProfileToForestUserInfo(res);
        setShouldRefetchUserProfile(true);
        if (forestUserInfo !== undefined) {
          setUserInfo(forestUserInfo);
          setTreesPlantedTargetLocal(forestUserInfo.targets.treesDonated ?? 0);
          setAreaRestoredTargetLocal(forestUserInfo.targets.areaRestored ?? 0);
          setAreaConservedTargetLocal(
            forestUserInfo.targets.areaConserved ?? 0
          );
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

        <div className={styles.targetModalSubContainer}>
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
