import React, { ReactElement, useState } from 'react';
import i18next from '../../../../../i18n';
import { useRouter } from 'next/router';
import { Button } from 'mui-latest';
import { useBulkCode } from '../../../common/Layout/BulkCodeContext';

import BulkCodesForm from './BulkCodesForm';
import ProjectSelector from './ProjectSelector';

const { useTranslation } = i18next;

interface SelectProjectFormProps {
  setStep?: (step: 0 | 1 | 2) => void;
}

const SelectProjectForm = ({
  setStep,
}: SelectProjectFormProps): ReactElement | null => {
  const router = useRouter();
  const { t, ready } = useTranslation(['common', 'bulkCodes']);
  const { method } = router.query;
  const { setProject } = useBulkCode();

  const [localProject, setLocalProject] = useState<string | null>(null);

  const handleFormSubmit = () => {
    setProject({
      guid: `${Math.random()}`,
      slug: localProject ?? '',
      unitCost: `${Math.random()}`,
      currency: `${Math.random()}`,
      unit: `${Math.random()}`,
      purpose: `${Math.random()}`,
    });
    router.push(`/profile/bulk-codes/${method}/jnkjansdkja`);
  };

  if (ready) {
    return (
      <BulkCodesForm className="ProjectSelectorForm">
        <div className="inputContainer">
          <ProjectSelector
            project={localProject}
            setProject={setLocalProject}
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          className="formButton"
          disabled={localProject === null}
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
