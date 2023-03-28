import React, { ReactElement, useState, useEffect } from 'react';
import { Autocomplete, TextField, styled } from '@mui/material';
import { useTranslation } from 'next-i18next';

import { Project } from '../../../../common/Layout/AnalyticsContext';

const MuiAutocomplete = styled(Autocomplete)(() => {
  return {
    '& .MuiAutocomplete-popupIndicatorOpen': {
      transform: 'none',
    },
    '& .Mui-disabled .iconFillColor': {
      fillOpacity: '38%',
    },
  };
});

interface ProjectSelectAutocompleteProps {
  projectList: Project[];
  project: Project | null;
  handleProjectChange?: (project: Project | null) => void; // eslint-disable-line no-unused-vars
}

const ProjectSelectAutocomplete = ({
  projectList,
  project = null,
  handleProjectChange,
}: ProjectSelectAutocompleteProps): ReactElement | null => {
  const [localProject, setLocalProject] = useState<Project | null>(project);
  const { t, ready } = useTranslation(['common']);

  useEffect(() => {
    setLocalProject(project);
  }, [project]);

  useEffect(() => {
    if (handleProjectChange) {
      handleProjectChange(localProject);
    }
  }, [localProject]);

  if (ready) {
    return (
      <MuiAutocomplete
        options={projectList}
        getOptionLabel={(option) => (option as Project).name}
        isOptionEqualToValue={(option, value) =>
          (option as Project).id === (value as Project).id
        }
        value={localProject}
        onChange={(_event, newValue: unknown) =>
          setLocalProject(newValue as Project | null)
        }
        renderOption={(props, option) => (
          <span {...props} key={(option as Project).id}>
            {(option as Project).name}
          </span>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t('project')}
            color="primary"
          />
        )}
      />
    );
  }

  return null;
};

export default ProjectSelectAutocomplete;
