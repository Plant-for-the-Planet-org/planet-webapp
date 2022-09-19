import React, { ReactElement, useContext, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Button } from '@mui/material';
import {
  useBulkCode,
  // PlanetCashAccount,
  Project,
} from '../../../common/Layout/BulkCodeContext';

import BulkCodesForm from './BulkCodesForm';
import ProjectSelector from '../components/ProjectSelector';
import BulkCodesError from '../components/BulkCodesError';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';

const SelectProjectForm = (): ReactElement | null => {
  const router = useRouter();
  const { t, ready } = useTranslation(['common', 'bulkCodes']);
  const { method } = router.query;
  const { project, setProject, projectList, planetCashAccount } = useBulkCode();
  const { user } = useContext(UserPropsContext);

  const [localProject, setLocalProject] = useState<Project | null>(project);

  const handleFormSubmit = () => {
    if (localProject) {
      setProject(localProject);
      router.push(`/profile/bulk-codes/${method}/${localProject.guid}`);
    }
  };

  if (ready) {
    return (
      <BulkCodesForm className="ProjectSelectorForm">
        <div className="inputContainer">
          <ProjectSelector
            projectList={projectList || []}
            project={localProject}
            setProject={setLocalProject}
            planetCashAccount={planetCashAccount}
          />
        </div>

        <BulkCodesError />

        <Button
          variant="contained"
          color="primary"
          className="formButton"
          disabled={
            !(
              user.planetCash &&
              !(user.planetCash.balance + user.planetCash.creditLimit <= 0)
            ) || localProject === null
          }
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
