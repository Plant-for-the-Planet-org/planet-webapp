import type { ReactElement } from 'react';
import type { PlanetCashAccount } from '../../../common/Layout/BulkCodeContext';
import type { PaymentOptions } from '../BulkCodesTypes';
import type { APIError, CountryProject } from '@planet-sdk/common';

import ProjectSelectAutocomplete from './ProjectSelectAutocomplete';
import UnitCostDisplay from './UnitCostDisplay';
import { handleError } from '@planet-sdk/common';
import { useApi } from '../../../../hooks/useApi';
import {
  useAuthStore,
  useUserStore,
  useErrorHandlingStore,
} from '../../../../stores';

interface ProjectSelectorProps {
  projectList: CountryProject[];
  project: CountryProject | null;
  setProject?: (project: CountryProject | null) => void;
  active?: boolean;
  planetCashAccount: PlanetCashAccount | null;
}
const ProjectSelector = ({
  projectList,
  project,
  setProject,
  active = true,
  planetCashAccount,
}: ProjectSelectorProps): ReactElement | null => {
  const { getApiAuthenticated } = useApi();
  //store: state
  const isAuthReady = useAuthStore(
    (state) => state.token !== null && state.isAuthResolved
  );
  const userProfile = useUserStore((state) => state.userProfile);
  //store: action
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  const fetchPaymentOptions = async (guid: string) => {
    const paymentOptions = await getApiAuthenticated<PaymentOptions>(
      `/app/paymentOptions/${guid}`,
      {
        queryParams: {
          country: planetCashAccount?.country || '',
          ...(userProfile !== null && { legacyPriceFor: userProfile.id }),
        },
      }
    );
    return paymentOptions;
  };

  const handleProjectChange = async (project: CountryProject | null) => {
    // fetch project details
    if (project && userProfile && isAuthReady) {
      try {
        const paymentOptions = await fetchPaymentOptions(project.guid);
        // Add/update project object
        if (paymentOptions) {
          project.currency = paymentOptions.currency;
          project.unitCost = paymentOptions.unitCost;
          project.unitType = paymentOptions.unitType;
          project.purpose = paymentOptions.purpose;
        }
      } catch (err) {
        setErrors(handleError(err as APIError));
      }
    }
    // set context
    if (setProject) {
      setProject(project);
    }
  };

  return (
    <>
      <ProjectSelectAutocomplete
        handleProjectChange={handleProjectChange}
        project={project}
        projectList={projectList || []}
        active={active}
      />
      <UnitCostDisplay
        unitCost={project ? project.unitCost : '-'}
        currency={planetCashAccount ? planetCashAccount.currency : ''}
        unitType={project?.unitType}
      />
    </>
  );
};

export default ProjectSelector;
