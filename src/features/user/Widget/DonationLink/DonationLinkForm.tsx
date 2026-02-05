import type { ReactElement } from 'react';
import type { ProjectOption } from '../../../common/types/project';
import type { ExtendedCountryCode } from '../../../common/types/country';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button, TextField } from '@mui/material';
import AutoCompleteCountry from '../../../common/InputTypes/AutoCompleteCountry';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
import supportedLanguages from '../../../../utils/language/supportedLanguages.json';

import ProjectSelectAutocomplete from '../../../common/ProjectSelectAutocomplete';
import { useTenant } from '../../../common/Layout/TenantContext';
import styles from '../../../../../src/features/user/Widget/DonationLink/DonationLinkForm.module.scss';
import CopyToClipboard from '../../../common/CopyToClipboard';
import {
  MuiAutoComplete,
  StyledAutoCompleteOption,
} from '../../../common/InputTypes/MuiAutoComplete';
import { allCountries } from '../../../../utils/constants/countries';
import CustomSnackbar from '../../../common/CustomSnackbar';
import StyledForm from '../../../common/Layout/StyledForm';
import QRCode from 'qrcode';
import NewToggleSwitch from '../../../common/InputTypes/NewToggleSwitch';

interface DonationLinkFormProps {
  projectsList: ProjectOption[] | null;
}

interface LanguageType {
  langCode: string;
  languageName: string;
}

const DonationLinkForm = ({
  projectsList,
}: DonationLinkFormProps): ReactElement | null => {
  const { user } = useUserProps();
  const [country, setCountry] = useState<ExtendedCountryCode | ''>('auto');
  const { tenantConfig } = useTenant();
  const [language, setLanguage] = useState<LanguageType>({
    langCode: 'auto',
    languageName: 'Automatic Selection',
  });
  const [donationUrl, setDonationUrl] = useState<string>('');
  const tDonationLink = useTranslations('DonationLink');
  const tCountry = useTranslations('Country');
  const tMe = useTranslations('Me');
  const [localProject, setLocalProject] = useState<ProjectOption | null>(null);
  const [isSupport, setIsSupport] = useState<boolean>(!user?.isPrivate);
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
      language && language.langCode != 'auto'
        ? `locale=${language.langCode}&`
        : '';

    const selectedCountry = country !== 'auto' ? `country=${country}&` : '';

    const url = `${link}?${selectedCountry}${selectedLanguage}${
      localProject == null ? '' : `to=${localProject.slug}&`
    }tenant=${tenantConfig?.id}${isSupport ? `&s=${user?.slug}` : ''}
    `;
    if (donationUrl.length > 0) setIsLinkUpdated(true);
    setDonationUrl(url);
  };

  const handleProjectChange = async (project: ProjectOption | null) => {
    setLocalProject(project);
  };

  useEffect(() => {
    handleUrlChange();
  }, [country, language, localProject, isSupport, isTesting]);

  useEffect(() => {
    const autoLanguage = {
      langCode: 'auto',
      languageName: `${tDonationLink('automaticSelection')}`,
    };
    if (!supportedLanguages.find((obj2) => obj2.langCode === 'auto'))
      supportedLanguages.unshift(autoLanguage as LanguageType);

    const autoCountry = {
      code: 'auto',
      label: tCountry('auto'),
      phone: '',
    } as const;
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
      downloadLink.download = tDonationLink('qrCodeFileName');
      downloadLink.click();
    }
  };

  if (isArrayUpdated && user) {
    return (
      <StyledForm>
        <div className="inputContainer">
          <div className={styles.formSection}>
            <div className={styles.formHeader}>
              {tDonationLink('countryLanguageTitle')}
            </div>
            <InlineFormDisplayGroup>
              <AutoCompleteCountry
                label={tDonationLink('labelCountry')}
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
                value={language}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="languageDropdown"
                    label={tDonationLink('labelLanguages')}
                    placeholder={tDonationLink('languages')}
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
              {tDonationLink('projectTitle')}
            </div>
            <ProjectSelectAutocomplete
              handleProjectChange={handleProjectChange}
              project={localProject}
              projectList={projectsList || []}
              showSearchIcon={true}
              label={tDonationLink('labelProject')}
            />
          </div>
          <div className={styles.formSection}>
            <div className={styles.formHeader}>
              {tDonationLink('treeCounterTitle')}
            </div>
            <InlineFormDisplayGroup type="other">
              <h6>{tDonationLink('treeCounterSubtitle')}</h6>
              <NewToggleSwitch
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
              <h6>{tDonationLink('treeCounterPrivateAccountSubtitle')}</h6>
            )}
          </div>
          <InlineFormDisplayGroup type="other">
            <div className={styles.formHeader}>
              {tDonationLink('testingTitle')}
            </div>
            <NewToggleSwitch
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
              <h6> {tDonationLink('testingModeSubtitle1')}</h6>
              <h6>
                {tDonationLink('testingModeSubtitle2')}{' '}
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
            <div className={styles.formHeader}>{tDonationLink('urlTitle')}</div>
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
                {tDonationLink('preview')}
              </Button>
            </div>
          </div>
          {qrCode && (
            <div className={styles.formSection}>
              <div className={styles.formHeader}>
                {tDonationLink('qrCodeTitle')}
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
                  {tMe('download')}
                </Button>
              </div>
            </div>
          )}
        </div>
        {isLinkUpdated && (
          <CustomSnackbar
            snackbarText={tDonationLink('linkAndQRCodeUpdatedMessage')}
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
