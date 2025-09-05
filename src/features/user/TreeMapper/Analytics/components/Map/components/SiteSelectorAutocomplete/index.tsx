import type {
  Feature,
  FeatureCollection,
} from '../../../../../../../common/types/dataExplorer';
import type { ReactElement, CSSProperties } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Autocomplete, TextField, styled } from '@mui/material';
import { useTranslations } from 'next-intl';

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

interface SitesSelectorAutocompleteProps {
  sitesList: FeatureCollection['features'];
  site: Feature | null;
  handleSiteChange?: (site: Feature | null) => void; // eslint-disable-line no-unused-vars
  styles?: CSSProperties | null;
}

const SitesSelectorAutocomplete = ({
  sitesList,
  site = null,
  handleSiteChange,
  styles = null,
}: SitesSelectorAutocompleteProps): ReactElement | null => {
  const [localSite, setLocalSite] = useState<Feature | null>(site);
  const t = useTranslations('TreemapperAnalytics');

  useEffect(() => {
    setLocalSite(site);
  }, [site]);

  useEffect(() => {
    if (handleSiteChange) {
      handleSiteChange(localSite);
    }
  }, [localSite]);

  return (
    <MuiAutocomplete
      style={styles ? styles : {}}
      options={sitesList}
      getOptionLabel={useCallback(
        (option) => (option as Feature).properties.name,
        []
      )}
      isOptionEqualToValue={useCallback(
        (option, value) =>
          (option as Feature).properties.name ===
          (value as Feature).properties.name,
        []
      )}
      value={localSite}
      onChange={(_event, newValue) => setLocalSite(newValue as Feature | null)}
      renderOption={(props, option) => (
        <span {...props} key={(option as Feature).properties.name}>
          {(option as Feature).properties.name}
        </span>
      )}
      renderInput={(params) => (
        <TextField {...params} label={t('sites')} color="primary" />
      )}
    />
  );
};

export default SitesSelectorAutocomplete;
