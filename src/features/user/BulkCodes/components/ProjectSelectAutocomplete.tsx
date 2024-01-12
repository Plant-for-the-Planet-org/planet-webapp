import React, { ReactElement, useState, useEffect } from 'react';
import { Autocomplete, TextField, styled } from '@mui/material';
import { useTranslation } from 'next-i18next';

import SearchIcon from '../../../../../public/assets/images/icons/SearchIcon';
import { ProjectOption } from '../../../common/types/project';

const MuiAutocomplete = styled(Autocomplete<ProjectOption>)(
  (/* { theme } */) => {
    return {
      '& .MuiAutocomplete-popupIndicatorOpen': {
        transform: 'none',
      },
      '& .Mui-disabled .iconFillColor': {
        fillOpacity: '38%',
      },
    };
  }
);

interface ProjectSelectAutocompleteProps {
  projectList: ProjectOption[];
  project: ProjectOption | null;
  handleProjectChange?: (project: ProjectOption | null) => void;
  active?: boolean;
}

// TODO - move this to a common folder
const ProjectSelectAutocomplete = ({
  projectList,
  project = null,
  handleProjectChange,
  active = true,
}: ProjectSelectAutocompleteProps): ReactElement | null => {
  const [localProject, setLocalProject] = useState<ProjectOption | null>(
    project
  );
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
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.guid === value.guid}
        value={localProject}
        onChange={(_event, newValue) => setLocalProject(newValue)}
        renderOption={(props, option) => (
          <span {...props} key={option.guid}>
            {option.name}
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
