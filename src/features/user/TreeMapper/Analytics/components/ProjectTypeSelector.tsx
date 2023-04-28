import React, { ReactElement, useState, useEffect } from 'react';
import { Autocomplete, TextField, styled } from '@mui/material';
import { useTranslation } from 'next-i18next';

/* eslint-disable no-unused-vars */
export enum ProjectType {
  INTERVENTIONS = 'interventions',
  MONITORING_PLOTS = 'monitoringPlots',
}
/* eslint-enable no-unused-vars */

const projectTypeList = [
  ProjectType.INTERVENTIONS,
  ProjectType.MONITORING_PLOTS,
];

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

interface ProjectTypeSelectorProps {
  handleProjectTypeChange?: (projectType: ProjectType | null) => void; // eslint-disable-line no-unused-vars
}

const ProjectTypeSelector = ({
  handleProjectTypeChange,
}: ProjectTypeSelectorProps): ReactElement | null => {
  const [localProjectType, setLocalProjectType] = useState<ProjectType | null>(
    null
  );
  const { t, ready } = useTranslation(['treemapperAnalytics']);

  useEffect(() => {
    setLocalProjectType(projectTypeList[0]);
  }, []);

  useEffect(() => {
    if (handleProjectTypeChange) {
      handleProjectTypeChange(localProjectType);
    }
  }, [localProjectType]);

  if (ready) {
    return (
      <MuiAutocomplete
        options={projectTypeList}
        getOptionLabel={(option) => t(option as ProjectType)}
        isOptionEqualToValue={(option, value) =>
          (option as ProjectType) === (value as ProjectType)
        }
        value={localProjectType}
        onChange={(_event, newValue: unknown) =>
          setLocalProjectType(newValue as ProjectType | null)
        }
        getOptionDisabled={(option) => option !== ProjectType.INTERVENTIONS}
        renderOption={(props, option) => (
          <span {...props} key={option as ProjectType}>
            {t(option as ProjectType)}
          </span>
        )}
        renderInput={(params) => (
          <TextField {...params} label={t('type')} color="primary" />
        )}
      />
    );
  }

  return null;
};

export default ProjectTypeSelector;
