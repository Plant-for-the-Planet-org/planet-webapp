import type { ReactElement } from 'react';
import type { PlanetCashAccount } from '../../../common/Layout/BulkCodeContext';
import type { PaymentOptions } from '../BulkCodesTypes';
import type { APIError, CountryProject } from '@planet-sdk/common';

import React from 'react';
import { getAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { useTenant } from '../../../common/Layout/TenantContext';
import ProjectSelectAutocomplete from './ProjectSelectAutocomplete';
import UnitCostDisplay from './UnitCostDisplay';
import { handleError } from '@planet-sdk/common';
import { useUserProps } from '../../../common/Layout/UserPropsContext';

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
  const { setErrors } = React.useContext(ErrorHandlingContext);
  const { tenantConfig } = useTenant();
  const { user, token, logoutUser, contextLoaded } = useUserProps();

  const fetchPaymentOptions = async (guid: string) => {
    const paymentOptions = await getAuthenticatedRequest<PaymentOptions>({
      tenant: tenantConfig?.id,
      url: `/app/paymentOptions/${guid}`,
      token,
      logoutUser,
      queryParams: {
        country: planetCashAccount?.country || '',
        ...(user !== null && { legacyPriceFor: user.id }),
      },
    });
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
