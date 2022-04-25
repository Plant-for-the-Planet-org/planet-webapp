import React, { ReactElement, useState } from 'react';
import i18next from '../../../../../i18n';
import { styled, Button } from 'mui-latest';

import ProjectSelectAutocomplete from './ProjectSelectAutocomplete';
import UnitCostDisplay from './UnitCostDisplay';

const { useTranslation } = i18next;

const ProjectSelectorForm = styled('form')(({ theme }) => {
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    alignItems: 'flex-start',
    '& .formButton': {
      marginTop: 24,
    },
    '& .inputContainer': {
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      width: '100%',
    },
  };
});

interface ProjectSelectorProps {
  setStep?: (step: 0 | 1 | 2) => void;
}

const ProjectSelector = ({
  setStep,
}: ProjectSelectorProps): ReactElement | null => {
  const [project, setProject] = useState<string | null>(null);
  const { t, ready } = useTranslation(['common', 'bulkCodes']);

  if (ready) {
    const handleProjectChange = (project: string | null) => {
      setProject(project);
    };

    return (
      <ProjectSelectorForm className="ProjectSelector">
        <div className="inputContainer">
          <ProjectSelectAutocomplete
            handleProjectChange={handleProjectChange}
            project={project}
          />
          <UnitCostDisplay unitCost={1.12} currency="USD" unit="tree" />
        </div>
        <Button
          variant="contained"
          color="primary"
          className="formButton"
          disabled={project === null}
          onClick={setStep ? () => setStep(2) : undefined}
        >
          {t('common:continue')}
        </Button>
      </ProjectSelectorForm>
    );
  }

  return null;
};

export default ProjectSelector;
