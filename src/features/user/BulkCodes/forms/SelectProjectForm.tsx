import type { ReactElement } from 'react';
import type { CountryProject } from '@planet-sdk/common';

import React, { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { Button } from '@mui/material';
import { useBulkCode } from '../../../common/Layout/BulkCodeContext';
import ProjectSelector from '../components/ProjectSelector';
import BulkCodesError from '../components/BulkCodesError';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import StyledForm from '../../../common/Layout/StyledForm';
import getLocalizedPath from '../../../../utils/getLocalizedPath';

const SelectProjectForm = (): ReactElement | null => {
  const router = useRouter();
  const tCommon = useTranslations('Common');
  const { method } = router.query;
  const { project, setProject, projectList, planetCashAccount } = useBulkCode();
  const { user } = useUserProps();
  const locale = useLocale();
  const [localProject, setLocalProject] = useState<CountryProject | null>(
    project
  );

  const handleFormSubmit = () => {
    if (localProject) {
      setProject(localProject);
      router.push(
        getLocalizedPath(
          `/profile/bulk-codes/${method}/${localProject.guid}`,
          locale
        )
      );
    }
  };

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
              user?.planetCash &&
              !(user.planetCash.balance + user.planetCash.creditLimit <= 0)
            ) || localProject === null
          }
          onClick={handleFormSubmit}
        >
          {tCommon('continue')}
        </Button>
      </StyledForm>
    </CenteredContainer>
  );
};

export default SelectProjectForm;
