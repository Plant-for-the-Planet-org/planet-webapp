import React, { ReactElement } from 'react';
// import i18next from '../../../../../i18n';

import ProjectSelectAutocomplete from './ProjectSelectAutocomplete';
import UnitCostDisplay from './UnitCostDisplay';

// const { useTranslation } = i18next;

interface ProjectSelectorProps {
  project: string | null;
  setProject?: (project: string | null) => void;
  active?: boolean;
}

const ProjectSelector = ({
  project,
  setProject,
  active = true,
}: ProjectSelectorProps): ReactElement | null => {
  // const { t, ready } = useTranslation(['common', 'bulkCodes']);

  const handleProjectChange = (project: string | null) => {
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
      <UnitCostDisplay unitCost={1.12} currency="USD" unit="tree" />
    </>
  );
};

export default ProjectSelector;
