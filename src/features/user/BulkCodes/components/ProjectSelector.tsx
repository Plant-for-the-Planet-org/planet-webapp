import React, { ReactElement } from 'react';
import { getRequest } from '../../../../utils/apiRequests/api';
import { PlanetCashAccount } from '../../../common/Layout/BulkCodeContext';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { PaymentOptions } from '../BulkCodesTypes';
import { ProjectOption } from '../../../common/types/project';
import { useTenant } from '../../../common/Layout/TenantContext';
import ProjectSelectAutocomplete from './ProjectSelectAutocomplete';
import UnitCostDisplay from './UnitCostDisplay';
import { handleError, APIError } from '@planet-sdk/common';
import { useUserProps } from '../../../common/Layout/UserPropsContext';

interface ProjectSelectorProps {
  projectList: ProjectOption[];
  project: ProjectOption | null;
  setProject?: (project: ProjectOption | null) => void;
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
  const defaultUnit = (project: ProjectOption | null) => {
    if (project?.purpose === 'conservation') return 'm2';

    return 'tree';
  };
  const { user } = useUserProps();

  const fetchPaymentOptions = async (guid: string) => {
    const paymentOptions = await getRequest<PaymentOptions>(
      `${tenantConfig?.id}`,
      `/app/paymentOptions/${guid}`,
      {
        country: planetCashAccount?.country || '',
        ...(user !== null && { profile: user.id }),
      }
    );
    return paymentOptions;
  };

  const handleProjectChange = async (project: ProjectOption | null) => {
    // fetch project details
    if (project) {
      try {
        const paymentOptions = await fetchPaymentOptions(project.guid);
        // Add to project object
        if (paymentOptions) {
          project.currency = paymentOptions.currency;
          project.unitCost = paymentOptions.unitCost;
          project.unit = paymentOptions.unit;
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
        unit={project?.unit ? project.unit : defaultUnit(project)}
      />
    </>
  );
};

export default ProjectSelector;
