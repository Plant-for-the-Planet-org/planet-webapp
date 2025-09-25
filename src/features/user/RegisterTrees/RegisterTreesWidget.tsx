import type { ChangeEvent } from 'react';
import type { ContributionProperties } from './RegisterTrees/SingleContribution';
import type { APIError, ProfileProjectFeature } from '@planet-sdk/common';
import type {
  RegisteredTreesGeometry,
  RegisterTreesFormProps,
} from '../../common/types/map';

import { useEffect, useState, useContext } from 'react';
import { handleError } from '@planet-sdk/common';
import { MenuItem, TextField, Button } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { localeMapForDate } from '../../../utils/language/getLanguageName';
import { getStoredConfig } from '../../../utils/storeConfig';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import styles from './RegisterModal.module.scss';
import SingleContribution from './RegisterTrees/SingleContribution';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import { MobileDatePicker as MuiDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import StyledForm from '../../common/Layout/StyledForm';
import InlineFormDisplayGroup from '../../common/Layout/Forms/InlineFormDisplayGroup';
import { useApi } from '../../../hooks/useApi';
import dynamic from 'next/dynamic';

type RegisteredTreesApiPayload = {
  treeCount: string;
  treeSpecies: string;
  plantProject: string | null;
  plantDate: Date;
  geometry: RegisteredTreesGeometry;
};

const RegisterTreeMap = dynamic(() => import('./Maps/RegisterTreeMap'), {
  ssr: false,
  loading: () => <p></p>,
});

function RegisterTreesForm({
  setContributionGUID,
  setContributionDetails,
  setRegistered,
}: RegisterTreesFormProps) {
  const { user, contextLoaded, setRefetchUserData } = useUserProps();
  const t = useTranslations('Me');
  const [isMultiple, setIsMultiple] = useState(false);
  const [userLocation, setUserLocation] = useState<number[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const [geometry, setGeometry] = useState<RegisteredTreesGeometry | undefined>(
    undefined
  );
  const [userLang, setUserLang] = useState('en');
  const [projects, setProjects] = useState<ProfileProjectFeature[]>([]);
  const { setErrors, redirect } = useContext(ErrorHandlingContext);
  const { postApiAuthenticated, getApiAuthenticated } = useApi();

  const [isUploadingData, setIsUploadingData] = useState(false);
  const defaultBasicDetails = {
    treeCount: '',
    species: '',
    plantProject: user?.type === 'tpo' ? '' : null,
    plantDate: new Date(),
    geometry: {},
  };
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: defaultBasicDetails,
  });

  const onTreeCountChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (Number(e.target.value) < 25) {
      setIsMultiple(false);
    } else {
      setIsMultiple(true);
    }
  };

  const submitRegisterTrees = async (data: FormData): Promise<void> => {
    const treeCount = parseInt(data.treeCount);
    if (treeCount < 10000000) {
      if (
        geometry &&
        (geometry.type === 'Point' || geometry.type === 'Polygon')
      ) {
        setIsUploadingData(true);
        const registeredTreesPayload: RegisteredTreesApiPayload = {
          treeCount: data.treeCount,
          treeSpecies: data.species,
          plantProject: data.plantProject,
          plantDate: new Date(data.plantDate),
          geometry: geometry,
        };
        try {
          const res = await postApiAuthenticated<
            ContributionProperties,
            RegisteredTreesApiPayload
          >('/app/contributions', {
            payload: registeredTreesPayload,
          });
          setErrorMessage('');
          setContributionGUID(res.id);
          setContributionDetails(res);
          setIsUploadingData(false);
          setRegistered(true);
          setRefetchUserData(true);
        } catch (err) {
          setIsUploadingData(false);
          setErrors(handleError(err as APIError));
          setRegistered(false);
        }
      } else {
        setErrorMessage(t('locationMissing'));
      }
    } else {
      setErrorMessage(t('wentWrong'));
    }
  };
  async function loadProjects() {
    try {
      const projects = await getApiAuthenticated<ProfileProjectFeature[]>(
        '/app/profile/projects'
      );
      setProjects(projects);
    } catch (err) {
      setErrors(handleError(err as APIError));
      redirect('/profile');
    }
  }

  useEffect(() => {
    if (contextLoaded && user?.type === 'tpo') {
      loadProjects();
    }
  }, [contextLoaded]);

  useEffect(() => {
    if (localStorage.getItem('language')) {
      const userLang = localStorage.getItem('language');
      if (userLang) setUserLang(userLang);
    }

    async function getUserLocation() {
      const location = await getStoredConfig('loc');
      if (location) {
        setUserLocation([
          Number(location.longitude) || 0,
          Number(location.latitude) || 0,
        ]);
      }
    }
    getUserLocation();
  }, []);

  return (
    <>
      <StyledForm>
        <div
          className="inputContainer"
          onSubmit={handleSubmit(submitRegisterTrees)}
        >
          <div className={styles.note}>
            <p>{t('registerTreesDescription')}</p>
          </div>
          <InlineFormDisplayGroup>
            <Controller
              name="treeCount"
              control={control}
              rules={{
                required: t('treesRequired'),
                validate: (value) => parseInt(value, 10) >= 1,
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextField
                  label={t('noOfTrees')}
                  variant="outlined"
                  onChange={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                    onTreeCountChange(e);
                    onChange(e.target.value);
                  }}
                  value={value}
                  onBlur={onBlur}
                  error={errors && errors.treeCount !== undefined}
                  helperText={
                    errors && errors.treeCount && errors.treeCount.message
                      ? errors.treeCount.message
                      : t('moreThanOne')
                  }
                />
              )}
            />
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={
                localeMapForDate[userLang]
                  ? localeMapForDate[userLang]
                  : localeMapForDate['en']
              }
            >
              <Controller
                name="plantDate"
                control={control}
                defaultValue={new Date()}
                render={({ field: { onChange, value } }) => (
                  <MuiDatePicker
                    label={t('datePlanted')}
                    value={value}
                    onChange={onChange}
                    renderInput={(props) => <TextField {...props} />}
                    disableFuture
                    minDate={new Date(new Date().setFullYear(1950))}
                    inputFormat="MMMM d, yyyy"
                    maxDate={new Date()}
                  />
                )}
              />
            </LocalizationProvider>
          </InlineFormDisplayGroup>
          <Controller
            name="species"
            control={control}
            rules={{ required: t('speciesIsRequired') }}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextField
                label={t('treeSpecies')}
                variant="outlined"
                onChange={onChange}
                value={value}
                onBlur={onBlur}
                error={errors && errors.species !== undefined}
                helperText={errors && errors.species && errors.species.message}
              />
            )}
          />
          {user && user.type === 'tpo' && (
            <Controller
              name="plantProject"
              control={control}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextField
                  label={t('project')}
                  variant="outlined"
                  select
                  onChange={onChange}
                  value={value}
                  onBlur={onBlur}
                  error={errors && errors.plantProject !== undefined}
                  helperText={
                    errors && errors.plantProject && errors.plantProject.message
                  }
                >
                  {projects.map((option) => (
                    <MenuItem
                      key={option.properties.id}
                      value={option.properties.id}
                    >
                      {option.properties.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          )}
          <div className={styles.mapNote}>
            {isMultiple ? (
              <p>{t('drawPolygon')}</p>
            ) : (
              <p>{t('selectLocation')}</p>
            )}
          </div>
          <RegisterTreeMap
            isMultiple={isMultiple}
            geometry={geometry}
            setGeometry={setGeometry}
            userLocation={userLocation}
          />
          {errorMessage !== null && (
            <div className={styles.center}>
              <p className={styles.formErrors}>{`${errorMessage}`}</p>
            </div>
          )}
          <div>
            <Button
              id={'RegTressSubmit'}
              onClick={handleSubmit(submitRegisterTrees)}
              variant="contained"
              color="primary"
            >
              {' '}
              {isUploadingData ? (
                <div className={'spinner'}></div>
              ) : (
                t('registerButton')
              )}
            </Button>
          </div>
        </div>
      </StyledForm>
    </>
  );
}

type FormData = {
  treeCount: string;
  species: string;
  plantProject: string | null;
  plantDate: Date;
  geometry: RegisteredTreesGeometry | undefined;
};

export default function RegisterTreesWidget() {
  const [contributionGUID, setContributionGUID] = useState('');
  const [contributionDetails, setContributionDetails] =
    useState<ContributionProperties | null>(null);
  const [registered, setRegistered] = useState(false);

  const ContributionProps = {
    contribution: contributionDetails !== null ? contributionDetails : null,
    contributionGUID,
  };

  return (
    <>
      {!registered ? (
        <RegisterTreesForm
          setContributionGUID={setContributionGUID}
          setContributionDetails={setContributionDetails}
          setRegistered={setRegistered}
        />
      ) : (
        <SingleContribution {...ContributionProps} />
      )}
    </>
  );
}
