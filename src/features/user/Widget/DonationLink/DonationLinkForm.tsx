import {
  ReactElement,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import {
  Alert,
  Autocomplete,
  Button,
  Snackbar,
  styled,
  Switch,
  TextField,
} from '@mui/material';
import i18next from '../../../../../i18n';
import { ProjectPropsContext } from '../../../../features/common/Layout/ProjectPropsContext';
import AutoCompleteCountry from '../../../common/InputTypes/AutoCompleteCountryNew';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';
import InlineFormDisplayGroup from './InlineFormDisplayGroup';
import supportedLanguages from '../../../../utils/language/supportedLanguages.json';
import React from 'react';
import { getRequest } from '../../../../utils/apiRequests/api';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import ProjectSelectAutocomplete from '../../BulkCodes/components/ProjectSelectAutocomplete';
import { Project } from '../../../common/Layout/BulkCodeContext';
import { TENANT_ID } from '../../../../utils/constants/environment';
const { useTranslation } = i18next;

// TODOO - refactor code for reuse?
const StyledForm = styled('form')((/* { theme } */) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  alignItems: 'flex-start',
  '& .formButton': {
    marginTop: 24,
  },
  '& .inputContainer': {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    width: '100%',
  },
}));

const DonationLinkForm = (): ReactElement | null => {
  const { user, contextLoaded } = useContext(UserPropsContext);
  const [country, setCountry] = useState(
    contextLoaded ? user.country : undefined
  );
  const [Languages, setLanguage] = useState({
    langCode: 'en',
    languageName: 'English',
  });
  const [donationUrl, setDonationUrl] = useState<string>('');
  const { t, ready } = useTranslation(['donationLink']);
  const { handleError } = useContext(ErrorHandlingContext);
  const { projects, setProjects, project } = useContext(ProjectPropsContext);
  const [localProject, setLocalProject] = useState<Project | null>(null);
  const [isSupport, setIsSupport] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  // Load all projects
  async function fetchProjectList() {
    const projectsList = await getRequest<
      [
        {
          properties: {
            id: string;
            name: string;
            slug: string;
            allowDonations: boolean;
            purpose: string;
            currency: string;
            unitCost: number;
          };
        }
      ]
    >(`/app/projects`, handleError, undefined, {
      _scope: 'default',
    });

    if (projectsList) {
      setProjects(projectsList);
    } else {
      setProjects([]);
    }
  }

  useEffect(() => {
    fetchProjectList();
  }, [projects]);

  const handleChange = () => {
    const url = `${
      process.env.NEXT_PUBLIC_DONATION_URL
    }?country=${country}&locale=${Languages.langCode}${
      localProject == null
        ? ''
        : `&to=${localProject.name.split(/\W+/).join('-').toLowerCase()}`
    }&tenant=${TENANT_ID}${isSupport ? `&s=${user.slug}` : ''}
    `;
    setDonationUrl(url);
  };

  const handleProjectChange = async (project: Project | null) => {
    setLocalProject(project);
  };

  useEffect(() => {
    handleChange();
  });

  const setTextCopiedClipboard = () => {
    navigator.clipboard.writeText(donationUrl);
    setIsCopied(!isCopied);
  };

  if (ready) {
    return (
      <StyledForm>
        <div>Donation Link Form</div>
        <div className="inputContainer">
          <div>Set the country and language</div>
          <InlineFormDisplayGroup>
            <AutoCompleteCountry
              label={t('labelCountry')}
              name="country"
              defaultValue={country}
              onChange={setCountry}
            />
            <Autocomplete
              id="Languages"
              options={supportedLanguages}
              getOptionLabel={(option) =>
                `${option.langCode} - ${option.languageName}`
              }
              isOptionEqualToValue={(option, value) =>
                option.langCode === value.langCode
              }
              value={Languages}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Language"
                  placeholder="Languages"
                />
              )}
              renderOption={(props, option) => (
                <span {...props} key={option.langCode}>
                  {`${option.langCode} - ${option.languageName}`}
                </span>
              )}
              sx={{ width: '50%' }}
              onChange={(event, newLan) => setLanguage(newLan)}
            />
          </InlineFormDisplayGroup>
          <div>Set your Project</div>
          <ProjectSelectAutocomplete
            handleProjectChange={handleProjectChange}
            project={project}
            projectList={projects || []}
            customIcon={false}
            active={true}
          />
          <div>Support my TreeCounter</div>
          <Switch
            checked={!user.isPrivate}
            onChange={() => {
              setIsSupport(!isSupport);
            }}
            disabled={user.isPrivate}
          />
          <div>Your Donation Link URL</div>
          <TextField
            id="outlined-read-only-input"
            InputProps={{
              readOnly: true,
            }}
            value={donationUrl}
            onChange={handleChange}
          />
          <Button
            id={'Preview'}
            variant="contained"
            color="primary"
            size="small"
            fullWidth={false}
            style={{
              maxWidth: '200px',
              marginTop: '24px',
              marginLeft: 'auto',
            }}
            onClick={() => window.open(donationUrl, '_blank')}
          >
            Preview
          </Button>
          <Button
            id={'Copy'}
            variant="contained"
            color="primary"
            size="small"
            fullWidth={false}
            style={{
              maxWidth: '200px',
              marginTop: '24px',
              marginLeft: 'auto',
            }}
            onClick={() => setTextCopiedClipboard()}
          >
            Copy
          </Button>
          <Snackbar
            open={isCopied}
            autoHideDuration={4000}
            onClose={setTextCopiedClipboard}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <div>
              <Alert
                elevation={6}
                variant="filled"
                onClose={setTextCopiedClipboard}
                severity="success"
              >
                {t('donate:Copied To Clipboard')}
              </Alert>
            </div>
          </Snackbar>
        </div>
      </StyledForm>
    );
  }

  return null;
};

export default DonationLinkForm;
