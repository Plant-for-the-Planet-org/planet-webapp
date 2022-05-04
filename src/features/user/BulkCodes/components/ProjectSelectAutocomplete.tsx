import React, {
  ReactElement,
  useState,
  useEffect,
  SyntheticEvent,
} from 'react';
import { Autocomplete, TextField, styled } from 'mui-latest';
import i18next from '../../../../../i18n';
// import bulkCodeProjects from '../bulkCodeProjects.json';

import SearchIcon from '../../../../../public/assets/images/icons/SearchIcon';
import { Project } from '../../../common/Layout/BulkCodeContext';

const { useTranslation } = i18next;

const MuiAutocomplete = styled(Autocomplete)((/* { theme } */) => {
  return {
    '& .MuiAutocomplete-popupIndicatorOpen': {
      transform: 'none',
    },
  };
});

interface ProjectSelectAutocompleteProps {
  projectList: Project[];
  project: Project | null;
  handleProjectChange?: (project: Project | null) => void;
  active: boolean;
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
        popupIcon={SearchIcon({})}
        options={projectList}
        getOptionLabel={(option: any) => option.name}
        isOptionEqualToValue={(option: any, value) => option.name === value}
        //TODOO Have left option as type: any here.
        value={localProject}
        onChange={(event: SyntheticEvent, newValue: unknown) =>
          setLocalProject(newValue as Project | null)
        }
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
