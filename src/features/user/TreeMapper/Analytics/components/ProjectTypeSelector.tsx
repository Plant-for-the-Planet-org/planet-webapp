import type { ReactElement, CSSProperties } from 'react';

import { useState, useEffect } from 'react';
import { Autocomplete, TextField, styled } from '@mui/material';
import { useTranslations } from 'next-intl';

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
  styles?: CSSProperties | null;
}

const ProjectTypeSelector = ({
  handleProjectTypeChange,
  styles = null,
}: ProjectTypeSelectorProps): ReactElement | null => {
  const [localProjectType, setLocalProjectType] = useState<ProjectType | null>(
    null
  );
  const t = useTranslations('TreemapperAnalytics');

  useEffect(() => {
    setLocalProjectType(projectTypeList[0]);
  }, []);

  useEffect(() => {
    if (handleProjectTypeChange) {
      handleProjectTypeChange(localProjectType);
    }
  }, [localProjectType]);

  return (
    <MuiAutocomplete
      style={styles ? styles : {}}
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
};

export default ProjectTypeSelector;
