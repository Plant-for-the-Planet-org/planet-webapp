import React, { ReactElement } from 'react';
import i18next from '../../../../../i18n';
import { Button } from 'mui-latest';

import BulkCodesForm from './BulkCodesForm';
import ProjectSelector from './ProjectSelector';

const { useTranslation } = i18next;

interface SelectProjectFormProps {
  setStep?: (step: 0 | 1 | 2) => void;
  setProject: (project: string | null) => void;
  project: string | null;
}

const SelectProjectForm = ({
  setStep,
  setProject,
  project,
}: SelectProjectFormProps): ReactElement | null => {
  const { t, ready } = useTranslation(['common', 'bulkCodes']);

  if (ready) {
    return (
      <BulkCodesForm className="ProjectSelectorForm">
        <div className="inputContainer">
          <ProjectSelector project={project} setProject={setProject} />
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
      </BulkCodesForm>
    );
  }

  return null;
};

export default SelectProjectForm;
