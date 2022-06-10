import React, { ReactElement } from 'react';
import { getRequest } from '../../../../utils/apiRequests/api';
import {
  PlanetCashAccount,
  Project,
} from '../../../common/Layout/BulkCodeContext';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
// import i18next from '../../../../../i18n';

import ProjectSelectAutocomplete from './ProjectSelectAutocomplete';
import UnitCostDisplay from './UnitCostDisplay';

// const { useTranslation } = i18next;

interface ProjectSelectorProps {
  projectList: Project[];
  project: Project | null;
  setProject?: (project: Project | null) => void;
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
  // const { t, ready } = useTranslation(['common', 'bulkCodes']);
  const { handleError } = React.useContext(ErrorHandlingContext);

  const defaultUnit = (project: Project | null) => {
    if (project?.purpose === 'conservation') return 'm2';

    return 'tree';
  };

  const fetchPaymentOptions = async (guid: string) => {
    const paymentOptions = await getRequest<{
      currency: string;
      unitCost: number;
      purpose: string;
      id: string;
      name: string;
      unit: string;
    }>(`/app/paymentOptions/${guid}`, handleError, undefined, {
      country: planetCashAccount?.country || '',
    });
    return paymentOptions;
  };

  const handleProjectChange = async (project: Project | null) => {
    // fetch project details
    if (project) {
      const paymentOptions = await fetchPaymentOptions(project.guid);
      // Add to project object
      if (paymentOptions) {
        project.currency = paymentOptions.currency;
        project.unitCost = paymentOptions.unitCost;
        project.unit = paymentOptions.unit;
        project.purpose = paymentOptions.purpose;
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
