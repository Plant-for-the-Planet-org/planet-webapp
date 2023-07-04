import { ReactElement, useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { Button, Switch, TextField } from '@mui/material';
import AutoCompleteCountry from '../../../common/InputTypes/AutoCompleteCountry';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
import supportedLanguages from '../../../../utils/language/supportedLanguages.json';
import React from 'react';
import ProjectSelectAutocomplete from '../../BulkCodes/components/ProjectSelectAutocomplete';
import { TENANT_ID } from '../../../../utils/constants/environment';
import styles from '../../../../../src/features/user/Widget/DonationLink/DonationLinkForm.module.scss';
import CopyToClipboard from '../../../common/CopyToClipboard';
import {
  MuiAutoComplete,
  StyledAutoCompleteOption,
} from '../../../common/InputTypes/MuiAutoComplete';
import { Project } from '../../../common/types/project';
import { allCountries } from '../../../../utils/constants/countries';
import CustomSnackbar from '../../../common/CustomSnackbar';
import StyledForm from '../../../common/Layout/StyledForm';
import QRCode from 'qrcode';

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
  const { user } = useUserProps();
  const [country, setCountry] = useState('auto');
  const [Languages, setLanguage] = useState<LanguageType>({
    langCode: 'auto',
    languageName: 'Automatic Selection',
  });
  const [donationUrl, setDonationUrl] = useState<string>('');
  const { t, ready } = useTranslation(['donationLink', 'country', 'me']);
  const [localProject, setLocalProject] = useState<Project | null>(null);
  const [isSupport, setIsSupport] = useState<boolean>(!user.isPrivate);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [isArrayUpdated, setIsArrayUpdated] = useState<boolean>(false);
  const [isLinkUpdated, setIsLinkUpdated] = useState<boolean>(false);
  const [qrCode, setQrCode] = useState<string | null>(null);

  const getDonationORCode = async () => {
    const data = await QRCode.toDataURL(donationUrl);
    setQrCode(data);
  };

  useEffect(() => {
    if (donationUrl) {
      getDonationORCode();
    }
  }, [donationUrl]);

  const handleUrlChange = () => {
    const link = isTesting
      ? process.env.NEXT_PUBLIC_TEST_DONATION_URL
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
    if (donationUrl.length > 0) setIsLinkUpdated(true);
    setDonationUrl(url);
  };

  const handleProjectChange = async (project: Project | null) => {
    setLocalProject(project);
  };

  useEffect(() => {
    handleUrlChange();
  }, [country, Languages, localProject, isSupport, isTesting]);

  useEffect(() => {
    const autoLanguage = {
      langCode: 'auto',
      languageName: `${t('donationLink:automaticSelection')}`,
    };
    if (!supportedLanguages.find((obj2) => obj2.langCode === 'auto'))
      supportedLanguages.unshift(autoLanguage as LanguageType);

    const autoCountry = {
      code: 'auto',
      label: `${t('country:auto')}`,
      phone: '',
    };
    if (!allCountries.find((obj2) => obj2.code === 'auto')) {
      allCountries.unshift(autoCountry);
    }
    setIsArrayUpdated(true);
  }, []);

  const handleSnackbarClose = () => {
    setIsLinkUpdated(false);
  };

  const downloadBase64File = () => {
    if (qrCode) {
      const linkSource = qrCode;
      const downloadLink = document.createElement('a');
      downloadLink.href = linkSource;
      downloadLink.download = t('donationLink:qrCodeFileName');
      downloadLink.click();
    }
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
                    label={t('donationLink:labelLanguages')}
                    placeholder={t('donationLink:languages')}
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
                onChange={(event, newLang) => {
                  if (newLang) {
                    setLanguage(newLang as LanguageType);
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
          <div className={styles.formSection}>
            <div className={styles.formHeader}>
              {t('donationLink:treeCounterTitle')}
            </div>
            <InlineFormDisplayGroup type="other">
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
            {user.isPrivate && (
              <h6>{t('donationLink:treeCounterPrivateAccountSubtitle')}</h6>
            )}
          </div>
          <InlineFormDisplayGroup type="other">
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
                {t('donationLink:testingModeSubtitle2')}{' '}
                <a
                  className="planet-links"
                  href="https://stripe.com/docs/testing"
                  target="_blank"
                  rel="noreferrer"
                >
                  stripe
                </a>{' '}
              </h6>
            </>
          )}
          <div className={styles.formSection}>
            <div className={styles.formHeader}>
              {t('donationLink:urlTitle')}
            </div>
            <InlineFormDisplayGroup type="other">
              <TextField
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
            <div>
              <Button
                id="Preview"
                variant="contained"
                color="primary"
                onClick={() => window.open(donationUrl, '_blank')}
              >
                {t('donationLink:preview')}
              </Button>
            </div>
          </div>
          {qrCode && (
            <div className={styles.formSection}>
              <div className={styles.formHeader}>
                {t('donationLink:qrCodeTitle')}
              </div>
              <img
                className={styles.qrContainer}
                id="base64image"
                src={qrCode}
              />
              <div>
                <Button
                  id="download-qr-code"
                  variant="contained"
                  color="primary"
                  onClick={downloadBase64File}
                >
                  {t('me:download')}
                </Button>
              </div>
            </div>
          )}
        </div>
        {isLinkUpdated && (
          <CustomSnackbar
            snackbarText={t('donationLink:linkAndQRCodeUpdatedMessage')}
            isVisible={isLinkUpdated}
            handleClose={handleSnackbarClose}
          />
        )}
      </StyledForm>
    );
  }

  return null;
};

export default DonationLinkForm;
