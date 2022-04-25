import React, {
  ReactElement,
  useState,
  useEffect,
  SyntheticEvent,
} from 'react';
import { Autocomplete, TextField, styled } from 'mui-latest';

import SearchIcon from '../../../../../public/assets/images/icons/SearchIcon';

const projects = [
  { label: 'Yucatan Reforestation' },
  { label: 'Pench Reforestation' },
  { label: 'Leipzig Reforestation' },
];

const MuiAutocomplete = styled(Autocomplete)(({ theme }) => {
  return {
    '& .MuiAutocomplete-popupIndicatorOpen': {
      transform: 'none',
    },
  };
});

interface ProjectSelectAutocompleteProps {
  project: string | null;
  handleProjectChange?: (project: string | null) => void;
}

const ProjectSelectAutocomplete = ({
  project = '',
  handleProjectChange,
}: ProjectSelectAutocompleteProps): ReactElement => {
  const [value, setValue] = useState<string | null>(project);

  useEffect(() => {
    if (handleProjectChange) {
      handleProjectChange(value);
    }
  }, [value]);

  return (
    <MuiAutocomplete
      popupIcon={SearchIcon({})}
      options={projects}
      value={value}
      onChange={(event: SyntheticEvent, newValue: unknown) =>
        setValue(newValue as string | null)
      }
      renderInput={(params) => (
        <TextField {...params} label="Project Name" color="primary" />
      )}
    />
  );
};

export default ProjectSelectAutocomplete;
