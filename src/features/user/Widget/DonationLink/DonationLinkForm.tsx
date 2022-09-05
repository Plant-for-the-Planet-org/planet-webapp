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
  MuiAutoComplete,
  StyledAutoCompleteOption,
} from '../../../common/InputTypes/MuiAutoComplete';
import { Project } from '../../../common/types/project';
import { allCountries } from '../../../../utils/constants/countries';
import CustomizedSnackbars from './CustomSnackBar';

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
  const { user } = useContext(UserPropsContext);
  const [country, setCountry] = useState('auto');
  const [Languages, setLanguage] = useState<LanguageType>({
    langCode: 'auto',
    languageName: 'Automatic Selection',
  });
  const [donationUrl, setDonationUrl] = useState<string>('');
  const { t, ready } = useTranslation(['donationLink', 'donate']);
  const [localProject, setLocalProject] = useState<Project | null>(null);
  const [isSupport, setIsSupport] = useState<boolean>(!user.isPrivate);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [isProjectSelected, setIsProjectSelected] = useState<boolean>(false);
  const [isArrayUpdated, setIsArrayUpdated] = useState<boolean>(false);
  const [isLinkUpdated, setIsLinkUpdated] = useState<boolean>(false);

  const handleUrlChange = () => {
    const link = isTesting
      ? 'http://paydev.pp.eco/'
      : process.env.NEXT_PUBLIC_DONATION_URL;

    const selectedLanguage =
      Languages && Languages.langCode != 'auto'
        ? `locale=${Languages.langCode}&`
        : '';

    const selectedCountry = country !== 'auto' ? `country=${country}&` : '';

    const url = `${link}?${selectedCountry}${selectedLanguage}${
      localProject == null ? '' : `to=${localProject.slug}&`
    }tenant=${TENANT_ID}${isSupport ? `&s=${user.slug}` : ''}
    `;
    setDonationUrl(url);
    setIsLinkUpdated(true);
  };

  const handleProjectChange = async (project: Project | null) => {
    setLocalProject(project);
    setIsProjectSelected(project == null);
  };

  useEffect(() => {
    handleUrlChange();
  }, [country, Languages, localProject, isSupport, isTesting]);

  useEffect(() => {
    const autoLanguage = {
      langCode: 'auto',
      languageName: 'Automatic Selection',
    };
    if (!supportedLanguages.find((obj2) => obj2.langCode === 'auto'))
      supportedLanguages.unshift(autoLanguage as LanguageType);

    const autoCountry = {
      code: 'auto',
      label: 'Automatic Selection',
      phone: '',
    };
    if (!allCountries.find((obj2) => obj2.code === 'auto')) {
      allCountries.unshift(autoCountry);
    }
    setIsArrayUpdated(true);
  }, []);

  const handleSnackbarClose = () => {
    setIsLinkUpdated(!isLinkUpdated);
  };

  if (isArrayUpdated && ready) {
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
                defaultValue={'auto'}
                onChange={setCountry}
                countries={allCountries}
              />
              <MuiAutoComplete
                id="language"
                options={supportedLanguages}
                getOptionLabel={(option) =>
                  `${(option as LanguageType).languageName}`
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
                    {(option as LanguageType).langCode !== 'auto' && (
                      <span>{`${(option as LanguageType).langCode}`}</span>
                    )}
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
          <div className={styles.formHeader}>
            {t('donationLink:treeCounterTitle')}
          </div>
          <InlineFormDisplayGroup>
            <h6>{t('donationLink:treeCounterSubtitle')}</h6>
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
          {isTesting && (
            <>
              <h6> {t('donationLink:testingModeSubtitle1')}</h6>
              <h6>
                {t('donationLink:testingModeSubtitle2')}
                <a
                  href="https://stripe.com/docs/testing"
                  target="_blank"
                  rel="noreferrer"
                >
                  {' '}
                  stripe
                </a>{' '}
              </h6>
            </>
          )}
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
          {isLinkUpdated && (
            <CustomizedSnackbars
              SnackBartext="Link has been updated"
              isVisible={isLinkUpdated}
              handleClose={handleSnackbarClose}
            />
          )}
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
