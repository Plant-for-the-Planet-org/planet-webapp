import React, { ReactElement, useState, useEffect, CSSProperties } from 'react';
import { Autocomplete, TextField, styled } from '@mui/material';
import { useTranslation } from 'next-i18next';
import {
  Feature,
  FeatureCollection,
} from '../../../../../../../common/types/dataExplorer';

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
  handleSiteChange?: (site: Site | null) => void; // eslint-disable-line no-unused-vars
  styles?: CSSProperties | null;
}

const SitesSelectorAutocomplete = ({
  sitesList,
  site = null,
  handleSiteChange,
  styles = null,
}: SitesSelectorAutocompleteProps): ReactElement | null => {
  const [localSite, setLocalSite] = useState<Site | null>(site);
  const { t, ready } = useTranslation(['treemapperAnalytics']);

  useEffect(() => {
    setLocalSite(site);
  }, [site]);

  useEffect(() => {
    if (handleSiteChange) {
      handleSiteChange(localSite);
    }
  }, [localSite]);

  if (ready) {
    return (
      <MuiAutocomplete
        style={styles ? styles : {}}
        options={sitesList}
        getOptionLabel={(option) => (option as Site).properties.name}
        isOptionEqualToValue={(option, value) =>
          (option as Site).properties.name === (value as Site).properties.name
        }
        value={localSite}
        onChange={(_event, newValue) => setLocalSite(newValue as Site | null)}
        renderOption={(props, option) => (
          <span {...props} key={(option as Site).properties.name}>
            {(option as Site).properties.name}
          </span>
        )}
        renderInput={(params) => (
          <TextField {...params} label={t('groups')} color="primary" />
        )}
      />
    );
  }

  return null;
};

export default SitesSelectorAutocomplete;
