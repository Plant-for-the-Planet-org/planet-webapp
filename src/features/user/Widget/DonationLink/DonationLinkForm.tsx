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
import ProjectSelectAutocomplete from '../../BulkCodes/components/ProjectSelectAutocomplete';
import { Project } from '../../../common/Layout/BulkCodeContext';
import { TENANT_ID } from '../../../../utils/constants/environment';
const { useTranslation } = i18next;
import styles from './DonationLinkForm.module.scss';
import CopyToClipboard from '../../../common/CopyToClipboard';
import ProjectsList from '../../../projects/screens/Projects';
import {
  MuiAutocomplete,
  StyledAutoCompleteOption,
} from '../../../common/InputTypes/AutoCompleteTheme';

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

interface DonationLinkFormProps {
  projectsList: Project[] | null;
}

const DonationLinkForm = ({
  projectsList,
}: DonationLinkFormProps): ReactElement | null => {
  const { user, contextLoaded } = useContext(UserPropsContext);
  const [country, setCountry] = useState(
    contextLoaded ? user.country : undefined
  );
  const [Languages, setLanguage] = useState({
    langCode: 'en',
    languageName: 'English',
  });
  const [donationUrl, setDonationUrl] = useState<string>('');
  const { t, ready } = useTranslation(['donationLink', 'donate']);
  const [localProject, setLocalProject] = useState<Project | null>(null);
  const [isSupport, setIsSupport] = useState<boolean>(!user.isPrivate);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [isProjectSelected, setIsProjectSelected] = useState<boolean>(false);
  // Load all projects

  const handleChange = () => {
    const link = isTesting
      ? 'http://paydev.pp.eco/'
      : process.env.NEXT_PUBLIC_DONATION_URL;
    const url = `${link}?country=${country}&locale=${Languages.langCode}${
      localProject == null
        ? ''
        : `&to=${localProject.name.split(/\W+/).join('-').toLowerCase()}`
    }&tenant=${TENANT_ID}${isSupport ? `&s=${user.slug}` : ''}
    `;
    setDonationUrl(url);
  };

  const handleProjectChange = async (project: Project | null) => {
    setLocalProject(project);
    setIsProjectSelected(!isProjectSelected);
  };

  useEffect(() => {
    handleChange();
  }, [country, Languages, localProject, isSupport, isTesting]);

  // const setTextCopiedClipboard = () => {
  //   navigator.clipboard.writeText(donationUrl);
  //   setIsCopied(!isCopied);
  // };

  if (ready) {
    return (
      <StyledForm>
        <div className="inputContainer">
          <div className={styles.singleFormGroup}>
            <div className={styles.formHeader}>
              {t('donationLink:countryLanguageTitle')}
            </div>
            <InlineFormDisplayGroup>
              <AutoCompleteCountry
                label={t('donationLink:labelCountry')}
                name="country"
                defaultValue={country}
                onChange={setCountry}
              />
              <MuiAutocomplete
                id={t('donationLink:labelLanguages')}
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
                    placeholder={t('donationLink:Languages')}
                  />
                )}
                renderOption={(props, option) => (
                  <StyledAutoCompleteOption {...props} key={option.langCode}>
                    <span>{`${option.langCode}`}</span>
                    {`- ${option.languageName}`}
                  </StyledAutoCompleteOption>
                )}
                onChange={(event, newLan) => setLanguage(newLan)}
              />
            </InlineFormDisplayGroup>
          </div>
          <div className={styles.singleFormGroup}>
            <div className={styles.formHeader}>
              {t('donationLink:projectTitle')}
            </div>
            <ProjectSelectAutocomplete
              handleProjectChange={handleProjectChange}
              project={localProject}
              projectList={projectsList || []}
              active={true}
            />
          </div>
          <InlineFormDisplayGroup>
            <div className={styles.formHeader}>
              {t('donationLink:treeCounterTitle')}
            </div>
            <Switch
              checked={isSupport}
              onChange={() => {
                setIsSupport(!isSupport);
              }}
              disabled={user.isPrivate}
            />
          </InlineFormDisplayGroup>
          <InlineFormDisplayGroup>
            <div className={styles.formHeader}>
              {t('donationLink:testingTitle')}
            </div>
            <Switch
              checked={isTesting}
              onChange={() => {
                setIsTesting(!isTesting);
              }}
              disabled={false}
            />
          </InlineFormDisplayGroup>
          <div className={styles.singleFormGroup}>
            <div className={styles.formHeader}>
              {t('donationLink:urlTitle')}
            </div>
            <InlineFormDisplayGroup>
              <TextField
                id="outlined-read-only-input"
                InputProps={{
                  readOnly: true,
                }}
                value={donationUrl}
                onChange={handleChange}
              />
              <CopyToClipboard isButton={true} text={donationUrl} />
            </InlineFormDisplayGroup>
          </div>
          <div className={styles.formButtonContainer}>
            <Button
              id={'Preview'}
              variant="contained"
              color="primary"
              fullWidth={false}
              onClick={() => window.open(donationUrl, '_blank')}
              disabled={isProjectSelected}
            >
              {t('donationLink:preview')}
            </Button>
            {/* <Button
              id={'Copy'}
              variant="outlined"
              color="primary"
              fullWidth={false}
              onClick={() => setTextCopiedClipboard()}
              disabled={isProjectSelected}
            >
              {t('donationLink:copy')}
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
            </Snackbar> */}
          </div>
        </div>
      </StyledForm>
    );
  }

  return null;
};

export default DonationLinkForm;
