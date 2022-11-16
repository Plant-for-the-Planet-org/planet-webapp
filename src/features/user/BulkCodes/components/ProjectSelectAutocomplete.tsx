import React, { ReactElement, useState, useEffect } from 'react';
import { Autocomplete, TextField, styled } from '@mui/material';
import { useTranslation } from 'next-i18next';

import SearchIcon from '../../../../../public/assets/images/icons/SearchIcon';
import { Project } from '../../../common/Layout/BulkCodeContext';

const MuiAutocomplete = styled(Autocomplete)((/* { theme } */) => {
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
  handleProjectChange?: (project: Project | null) => void;
  active?: boolean;
}

const ProjectSelectAutocomplete = ({
  projectList,
  project,
  handleProjectChange,
  active = true,
}: ProjectSelectAutocompleteProps): ReactElement | null => {
  const [localProject, setLocalProject] = useState<Project | null>(project);
  const { t, ready } = useTranslation(['bulkCodes']);

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
        popupIcon={SearchIcon()}
        options={projectList}
        getOptionLabel={(option) => (option as Project).name}
        isOptionEqualToValue={(option, value) =>
          (option as Project).guid === (value as Project).guid
        }
        value={localProject}
        onChange={(_event, newValue: unknown) =>
          setLocalProject(newValue as Project | null)
        }
        renderOption={(props, option) => (
          <span {...props} key={(option as Project).guid}>
            {(option as Project).name}
          </span>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t('bulkCodes:projectName')}
            color="primary"
          />
        )}
        disabled={!active}
      />
    );
  }

  return null;
};

export default ProjectSelectAutocomplete;
