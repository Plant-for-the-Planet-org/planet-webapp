import styles from './index.module.scss';
import ProjectTypeSelector, { ProjectType } from '../../../ProjectTypeSelector';
import { MuiAutoComplete } from '../../../../../../../common/InputTypes/MuiAutoComplete';
import SitesSelectorAutocomplete from '../SiteSelectorAutocomplete';
import { TextField } from '@mui/material';
import { SetState } from '../../../../../../../common/types/common';
import {
  Feature,
  FeatureCollection,
} from '../../../../../../../common/types/dataExplorer';
import { useTranslations } from 'next-intl';

interface Props {
  handleProjectTypeChange: (projType: ProjectType | null) => void;
  distinctSpeciesList: string[];
  species: string | null;
  setSpecies: SetState<string | null>;
  projectSites: FeatureCollection | null;
  projectSite: Feature | null;
  handleSiteChange: (site: Feature | null) => void;
}

const LeftElements = ({
  handleProjectTypeChange,
  distinctSpeciesList,
  species,
  setSpecies,
  projectSites,
  projectSite,
  handleSiteChange,
}: Props) => {
  const t = useTranslations('TreemapperAnalytics');
  return (
    <div className={styles.container}>
      <SitesSelectorAutocomplete
        sitesList={projectSites ? projectSites.features : []}
        site={projectSite}
        handleSiteChange={handleSiteChange}
        styles={{ minWidth: '200px' }}
      />
      <ProjectTypeSelector
        handleProjectTypeChange={handleProjectTypeChange}
        styles={{ minWidth: '200px' }}
      />
      <MuiAutoComplete
        style={{ minWidth: '200px' }}
        options={distinctSpeciesList}
        getOptionLabel={(option) => option as string}
        isOptionEqualToValue={(option, value) => option === value}
        value={species}
        onChange={(_event, newValue) => setSpecies(newValue as string | null)}
        renderOption={(props, option) => (
          <span {...props} key={option as string}>
            {option}
          </span>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t('plantLocationsWithPlantedSpecies')}
            color="primary"
          />
        )}
      />
    </div>
  );
};

export default LeftElements;
