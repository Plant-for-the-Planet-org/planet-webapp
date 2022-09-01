import { ReactElement, useContext, useState, useEffect } from 'react';
import { Button, styled, Switch, TextField } from '@mui/material';
import i18next from '../../../../../i18n';
import AutoCompleteCountry from '../../../common/InputTypes/AutoCompleteCountryNew';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
import supportedLanguages from '../../../../utils/language/supportedLanguages.json';
import React from 'react';
import ProjectSelectAutocomplete from '../../BulkCodes/components/ProjectSelectAutocomplete';
import { TENANT_ID } from '../../../../utils/constants/environment';
const { useTranslation } = i18next;
import styles from './DonationLinkForm.module.scss';
import CopyToClipboard from '../../../common/CopyToClipboard';
import {
  MuiAutocomplete,
  StyledAutoCompleteOption,
} from '../../../common/InputTypes/AutoCompleteTheme';
import { Project } from '../../../common/types/project';

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

const MuiTextField = styled(TextField)(() => {
  return {
    flex: '1',
    minWidth: 240,
  };
});

interface DonationLinkFormProps {
  projectsList: Project[] | null;
}

interface LanguageType {
  langCode: string;
  languageName: string;
}

const DonationLinkForm = ({
  projectsList,
}: DonationLinkFormProps): ReactElement | null => {
  const { user, contextLoaded } = useContext(UserPropsContext);
  const [country, setCountry] = useState(
    contextLoaded ? user.country : undefined
  );
  const [Languages, setLanguage] = useState({
    langCode: '',
    languageName: 'Automatic Selection',
  });
  const [donationUrl, setDonationUrl] = useState<string>('');
  const { t, ready } = useTranslation(['donationLink', 'donate']);
  const [localProject, setLocalProject] = useState<Project | null>(null);
  const [isSupport, setIsSupport] = useState<boolean>(!user.isPrivate);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [isProjectSelected, setIsProjectSelected] = useState<boolean>(false);

  const handleUrlChange = () => {
    const link = isTesting
      ? 'http://paydev.pp.eco/'
      : process.env.NEXT_PUBLIC_DONATION_URL;

    const selectedLanguage =
      Languages && Languages.langCode != ''
        ? `&locale=${Languages.langCode}`
        : '';

    const url = `${link}?country=${country}${selectedLanguage}${
      localProject == null ? '' : `&to=${localProject.slug}`
    }&tenant=${TENANT_ID}${isSupport ? `&s=${user.slug}` : ''}
    `;
    setDonationUrl(url);
  };

  const handleProjectChange = async (project: Project | null) => {
    setLocalProject(project);
    setIsProjectSelected(project == null);
  };

  useEffect(() => {
    handleUrlChange();
  }, [country, Languages, localProject, isSupport, isTesting]);

  useEffect(() => {
    supportedLanguages.push({
      langCode: '',
      languageName: 'Automatic Selection',
    });
  }, []);

  if (ready) {
    return (
      <StyledForm>
        <div className="inputContainer">
          <div className={styles.formSection}>
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
                id="language"
                options={supportedLanguages}
                getOptionLabel={(option) =>
                  `${(option as LanguageType).langCode}  ${
                    (option as LanguageType).languageName
                  }`
                }
                isOptionEqualToValue={(option, value) =>
                  (option as LanguageType).langCode ===
                  (value as LanguageType).langCode
                }
                value={Languages}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="languagedropdown"
                    label="Language"
                    placeholder={t('donationLink:Languages')}
                  />
                )}
                renderOption={(props, option) => (
                  <StyledAutoCompleteOption
                    {...props}
                    key={(option as LanguageType).langCode}
                  >
                    <span>{`${(option as LanguageType).langCode}`}</span>
                    {` ${(option as LanguageType).languageName}`}
                  </StyledAutoCompleteOption>
                )}
                onChange={(event, newLan) => {
                  if (newLan) {
                    setLanguage(newLan as LanguageType);
                  }
                }}
              />
            </InlineFormDisplayGroup>
          </div>
          <div className={styles.formSection}>
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
              id="treeCounter"
              name="treeCounter"
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
              id="testing"
              name="testing"
              checked={isTesting}
              onChange={() => {
                setIsTesting(!isTesting);
              }}
              disabled={false}
            />
          </InlineFormDisplayGroup>
          <div className={styles.formSection}>
            <div className={styles.formHeader}>
              {t('donationLink:urlTitle')}
            </div>
            <InlineFormDisplayGroup>
              <MuiTextField
                id="donation-url"
                name="donation-url"
                InputProps={{
                  readOnly: true,
                }}
                value={donationUrl}
                onChange={handleUrlChange}
              />
              <CopyToClipboard isButton={true} text={donationUrl} />
            </InlineFormDisplayGroup>
          </div>
          <div className={styles.formButtonContainer}>
            <Button
              id="Preview"
              name="Preview"
              variant="contained"
              color="primary"
              fullWidth={false}
              onClick={() => window.open(donationUrl, '_blank')}
              disabled={isProjectSelected}
            >
              {t('donationLink:preview')}
            </Button>
          </div>
        </div>
      </StyledForm>
    );
  }

  return null;
};

export default DonationLinkForm;
