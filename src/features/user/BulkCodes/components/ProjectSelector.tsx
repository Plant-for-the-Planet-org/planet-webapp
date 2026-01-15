import type { ReactElement } from 'react';
import type { PlanetCashAccount } from '../../../common/Layout/BulkCodeContext';
import type { PaymentOptions } from '../BulkCodesTypes';
import type { APIError, CountryProject } from '@planet-sdk/common';

import { useContext } from 'react';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import ProjectSelectAutocomplete from './ProjectSelectAutocomplete';
import UnitCostDisplay from './UnitCostDisplay';
import { handleError } from '@planet-sdk/common';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { useApi } from '../../../../hooks/useApi';
import { useAuthStore } from '../../../../stores/authStore';

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
  const { setErrors } = useContext(ErrorHandlingContext);
  const { user, contextLoaded } = useUserProps();
  const { getApiAuthenticated } = useApi();
  //store: state
  const token = useAuthStore((state) => state.token);

  const fetchPaymentOptions = async (guid: string) => {
    const paymentOptions = await getApiAuthenticated<PaymentOptions>(
      `/app/paymentOptions/${guid}`,
      {
        queryParams: {
          country: planetCashAccount?.country || '',
          ...(user !== null && { legacyPriceFor: user.id }),
        },
      }
    );
    return paymentOptions;
  };

  const handleProjectChange = async (project: CountryProject | null) => {
    // fetch project details
    if (project && user && token && contextLoaded) {
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
