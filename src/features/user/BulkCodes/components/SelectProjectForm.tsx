import React, { ReactElement } from 'react';
import i18next from '../../../../../i18n';
import { useRouter } from 'next/router';
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
  const router = useRouter();
  const { t, ready } = useTranslation(['common', 'bulkCodes']);
  const { method } = router.query;

  const handleFormSubmit = () => {
    router.push(`/profile/bulk-codes/${method}/jnkjansdkja`);
  };

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
          onClick={handleFormSubmit}
        >
          {t('common:continue')}
        </Button>
      </BulkCodesForm>
    );
  }

  return null;
};

export default SelectProjectForm;
