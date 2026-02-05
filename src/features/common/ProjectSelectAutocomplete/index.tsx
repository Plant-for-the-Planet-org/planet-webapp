import type { ReactElement } from 'react';

import { useState, useEffect } from 'react';
import { Autocomplete, TextField, styled } from '@mui/material';
import { useTranslations } from 'next-intl';
import SearchIcon from '../../../../public/assets/images/icons/SearchIcon';

export interface BaseProject {
  guid: string;
  name: string;
}

const MuiAutocomplete = styled(Autocomplete<BaseProject>)(() => {
  return {
    '& .MuiAutocomplete-popupIndicatorOpen': {
      transform: 'none',
    },
    '& .Mui-disabled .iconFillColor': {
      fillOpacity: '38%',
    },
  };
});

interface ProjectSelectAutocompleteProps<T extends BaseProject> {
  projectList: T[];
  project: T | null;
  handleProjectChange?: (project: T | null) => void;
  disabled?: boolean;
  showSearchIcon?: boolean;
  label?: string;
}

const ProjectSelectAutocomplete = <T extends BaseProject>({
  projectList,
  project = null,
  handleProjectChange,
  disabled = false,
  showSearchIcon = false,
  label,
}: ProjectSelectAutocompleteProps<T>): ReactElement | null => {
  const [localProject, setLocalProject] = useState<T | null>(project);
  const t = useTranslations('Common');

  useEffect(() => {
    setLocalProject(project);
  }, [project]);

  useEffect(() => {
    if (handleProjectChange) {
      handleProjectChange(localProject);
    }
  }, [localProject]);

  return (
    <MuiAutocomplete
      popupIcon={showSearchIcon ? SearchIcon() : undefined}
      options={projectList}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.guid === value.guid}
      value={localProject}
      onChange={(_event, newValue) => setLocalProject(newValue as T | null)}
      renderOption={(props, option) => (
        <span {...props} key={option.guid}>
          {option.name}
        </span>
      )}
      renderInput={(params) => (
        <TextField {...params} label={label || t('project')} />
      )}
      disabled={disabled}
    />
  );
};

export default ProjectSelectAutocomplete;
