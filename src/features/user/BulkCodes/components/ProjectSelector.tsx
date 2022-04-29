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
  project: Project | null;
  setProject: (project: Project | null) => void;
  active?: boolean;
  planetCashAccount: PlanetCashAccount | null;
}

const ProjectSelector = ({
  project,
  setProject,
  active = true,
  planetCashAccount,
}: ProjectSelectorProps): ReactElement | null => {
  // const { t, ready } = useTranslation(['common', 'bulkCodes']);
  const { handleError } = React.useContext(ErrorHandlingContext);

  const fetchProjectDetails = async (
    guid: string
  ): Promise<
    | {
        properties: {
          currency: string;
          unitCost: number;
          purpose: string;
        };
      }
    | undefined
  > => {
    try {
      const project = await getRequest(
        `/app/projects/${guid}`,
        handleError,
        undefined,
        {
          _scope: 'map',
          currency: planetCashAccount?.currency || 'USD',
        }
      );
      return project;
    } catch (err) {
      console.log(err);
    }
  };

  const handleProjectChange = async (project: Project | null) => {
    // fetch project details
    if (project) {
      const projectDetails = await fetchProjectDetails(project.guid);
      // Add to project object
      if (projectDetails) {
        project.currency = projectDetails.properties.currency;
        project.unitCost = projectDetails.properties.unitCost;
        project.unit = 'tree';
        project.purpose = projectDetails.properties.purpose;
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
        active={active}
      />
      <UnitCostDisplay
        unitCost={project ? project.unitCost : '-'}
        currency={project ? project.currency : ''}
        unit={project ? project.unit : '-'}
      />
    </>
  );
};

export default ProjectSelector;
