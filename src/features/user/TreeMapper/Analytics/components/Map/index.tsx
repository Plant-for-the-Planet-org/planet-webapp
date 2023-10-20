import { useEffect, useState } from 'react';
import { Container } from '../Container';
import ProjectTypeSelector, { ProjectType } from '../ProjectTypeSelector';
import useNextRequest, {
  HTTP_METHOD,
} from '../../../../../../hooks/use-next-request';
import {
  DistinctSpecies,
  Site,
} from '../../../../../common/types/dataExplorer';
import { useAnalytics } from '../../../../../common/Layout/AnalyticsContext';
import LeftElements from './components/LeftElements';
import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Search } from '@mui/icons-material';
import moment from 'moment';
import SitesSelectorAutocomplete from './components/SiteSelectorAutocomplete';
import { MuiAutoComplete } from '../../../../../common/InputTypes/MuiAutoComplete';


export const MapContainer = () => {
  const [_, setProjectType] = useState<ProjectType | null>(null);
  const [distinctSpeciesList, setDistinctSpeciesList] =
    useState<DistinctSpecies>([]);
  const [species, setSpecies] = useState<string | null>(null);
  const [projectSites, setProjectSites] = useState<Site[]>([]);
  const [projectSite, setProjectSite] = useState<Site | null>(null);
  const [search, setSearch] = useState<string>('');
  const { project } = useAnalytics();
  const { t, ready } = useTranslation(['treemapperAnalytics']);

  const { makeRequest } = useNextRequest<{ data: DistinctSpecies }>({
    url: `/api/data-explorer/map/distinct-species/${project?.id}`,
    method: HTTP_METHOD.GET,
  });

  const { makeRequest: makeReqToFetchProjectSites } = useNextRequest<{
    data: Site[];
  }>({
    url: `/api/data-explorer/map/sites/${project?.id}`,
    method: HTTP_METHOD.GET,
  });

  const fetchDistinctSpecies = async () => {
    const res = await makeRequest();
    if (res) {
      setDistinctSpeciesList(res.data);
      setSpecies(res.data[0] ? res.data[0] : null);
    }
  };

  const fetchProjectSites = async () => {
    const res = await makeReqToFetchProjectSites();
    if (res) {
      setProjectSites(res.data);
      setProjectSite(res.data[0] ? res.data[0] : null);
    }
  };

  useEffect(() => {
    if (project) {
      fetchDistinctSpecies();
      fetchProjectSites();
    }
  }, [project]);

  const handleProjectTypeChange = (projType: ProjectType | null) => {
    setProjectType(projType);
  };

  const handleSiteChange = (site: Site | null) => {
    setProjectSite(site);
  };

  return ready ? (
    <Container
      leftElement={
        <LeftElements>
          <ProjectTypeSelector
            handleProjectTypeChange={handleProjectTypeChange}
            styles={{ width: '200px' }}
          />
          <MuiAutoComplete
            style={{ width: '200px' }}
            options={distinctSpeciesList}
            getOptionLabel={(option) => option as string}
            isOptionEqualToValue={(option, value) => option === value}
            value={species}
            onChange={(_event, newValue) =>
              setSpecies(newValue as string | null)
            }
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
          <TextField
            style={{ width: '150px' }}
            label={t('search')}
            InputProps={{
              startAdornment: <Search />,
            }}
            value={search}
            placeholder={moment().format('YYYY-MM-DD')}
            onChange={(e) => setSearch(e.target.value)}
          />
        </LeftElements>
      }
      rightElement={
        <SitesSelectorAutocomplete
          sitesList={projectSites}
          site={projectSite}
          handleSiteChange={handleSiteChange}
          styles={{ width: '200px' }}
        />
      }
    >
      <div>
        <h1>Map</h1>
      </div>
    </Container>
  ) : (
    <></>
  );
};
