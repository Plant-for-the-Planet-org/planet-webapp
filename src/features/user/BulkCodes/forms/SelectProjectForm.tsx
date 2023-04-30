import React, { ReactElement, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Button } from '@mui/material';
import {
  useBulkCode,
  // PlanetCashAccount,
  Project,
} from '../../../common/Layout/BulkCodeContext';

import ProjectSelector from '../components/ProjectSelector';
import BulkCodesError from '../components/BulkCodesError';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import StyledForm from '../../../common/Layout/StyledForm';

const SelectProjectForm = (): ReactElement | null => {
  const router = useRouter();
  const { t, ready } = useTranslation(['common', 'bulkCodes']);
  const { method } = router.query;
  const { project, setProject, projectList, planetCashAccount } = useBulkCode();
  const { user } = useUserProps();

  const [localProject, setLocalProject] = useState<Project | null>(project);

  const handleFormSubmit = () => {
    if (localProject) {
      setProject(localProject);
      router.push(`/profile/bulk-codes/${method}/${localProject.guid}`);
    }
  };

  if (ready) {
    return (
      <CenteredContainer>
        <StyledForm className="ProjectSelectorForm">
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
        </StyledForm>
      </CenteredContainer>
    );
  }

  return null;
};

export default SelectProjectForm;
