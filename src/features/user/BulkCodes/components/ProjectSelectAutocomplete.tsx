import React, {
  ReactElement,
  useState,
  useEffect,
  SyntheticEvent,
} from 'react';
import { Autocomplete, TextField, styled } from 'mui-latest';
import i18next from '../../../../../i18n';
import bulkCodeProjects from '../bulkCodeProjects.json';

import SearchIcon from '../../../../../public/assets/images/icons/SearchIcon';

const { useTranslation } = i18next;

const MuiAutocomplete = styled(Autocomplete)((/* { theme } */) => {
  return {
    '& .MuiAutocomplete-popupIndicatorOpen': {
      transform: 'none',
    },
  };
});

interface ProjectSelectAutocompleteProps {
  project: Object | null;
  handleProjectChange?: (project: Object | null) => void;
  active: boolean;
}

const ProjectSelectAutocomplete = ({
  project,
  handleProjectChange,
  active = true,
}: ProjectSelectAutocompleteProps): ReactElement | null => {
  const [value, setValue] = useState<Object | null>(project);
  const { t, ready } = useTranslation(['bulkCodes']);

  useEffect(() => {
    if (handleProjectChange) {
      handleProjectChange(value);
    }
  }, [value]);

  if (ready) {
    return (
      <MuiAutocomplete
        popupIcon={SearchIcon({})}
        options={bulkCodeProjects}
        getOptionLabel={(option) => option.slug}
        value={value}
        onChange={(event: SyntheticEvent, newValue: unknown) =>
          setValue(newValue as Object | null)
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
