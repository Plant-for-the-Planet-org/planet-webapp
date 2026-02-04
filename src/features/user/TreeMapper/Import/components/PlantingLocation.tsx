import type { ReactElement } from 'react';
import type { FieldErrors, FieldArrayWithId, Control } from 'react-hook-form';
import type {
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  GeometryObject,
} from 'geojson';
import type { Species } from '../../Treemapper';
import type { InterventionFormData, SpeciesFormData } from '../../Treemapper';
import type { SetState } from '../../../../common/types/common';
import type {
  APIError,
  Intervention,
  ProfileProjectFeature,
} from '@planet-sdk/common';

import { useEffect, useState, useCallback } from 'react';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import styles from '../Import.module.scss';
import { useTranslations } from 'next-intl';
import { localeMapForDate } from '../../../../../utils/language/getLanguageName';
import { useDropzone } from 'react-dropzone';
import DeleteIcon from '../../../../../../public/assets/images/icons/manageProjects/Delete';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { Button, MenuItem, TextField } from '@mui/material';
import tj from '@mapbox/togeojson';
import gjv from 'geojson-validation';
import flatten from 'geojson-flatten';
import { MobileDatePicker as MuiDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { handleError } from '@planet-sdk/common';
import { useApi } from '../../../../../hooks/useApi';
import { clsx } from 'clsx';
import {
  useAuthStore,
  useErrorHandlingStore,
  useUserStore,
} from '../../../../../stores';

// import { DevTool } from '@hookform/devtools';

interface SpeciesProps {
  index: number;
  remove: Function;
  errors: FieldErrors<InterventionFormData>;
  item: FieldArrayWithId<InterventionFormData, 'plantedSpecies', 'id'>;
  control: Control<InterventionFormData>;
}

function PlantedSpecies({
  index,
  remove,
  errors,
  item,
  control,
}: SpeciesProps): ReactElement {
  const tTreemapper = useTranslations('Treemapper');
  return (
    <div key={item.id} className={styles.speciesFieldGroup}>
      <div className={styles.speciesNameField}>
        {/* <SpeciesSelect label={tTreemapper('species')} name={`plantedSpecies[${index}].species`} mySpecies={mySpecies} control={control} /> */}
        <Controller
          name={`plantedSpecies.${index}.otherSpecies`}
          control={control}
          rules={{
            required:
              index > 0 ? false : tTreemapper('atLeastOneSpeciesRequired'),
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label={tTreemapper('treeSpecies')}
              variant="outlined"
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              error={
                errors.plantedSpecies &&
                errors.plantedSpecies[index]?.otherSpecies !== undefined
              }
              helperText={
                errors.plantedSpecies &&
                errors.plantedSpecies[index]?.otherSpecies &&
                (errors.plantedSpecies[index]?.otherSpecies?.message ?? '')
              }
            />
          )}
        />
      </div>
      <div className={styles.speciesCountField}>
        <Controller
          name={`plantedSpecies.${index}.treeCount`}
          control={control}
          rules={{
            required: index > 0 ? false : tTreemapper('treesRequired'),
            validate: (value) => {
              return Number(value) >= 1 ? true : tTreemapper('treesRequired');
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label={tTreemapper('count')}
              variant="outlined"
              onChange={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                onChange(e.target.value);
              }}
              value={value > 0 ? value : ''}
              onBlur={onBlur}
              error={
                errors.plantedSpecies &&
                errors.plantedSpecies[index]?.treeCount !== undefined
              }
              helperText={
                errors.plantedSpecies &&
                errors.plantedSpecies[index]?.treeCount &&
                (errors.plantedSpecies[index]?.treeCount?.message ?? '')
              }
            />
          )}
        />
      </div>
      {index > 0 ? (
        <div
          onClick={() => remove(index)}
          className={clsx(styles.speciesDeleteField, styles.deleteActive)}
        >
          <DeleteIcon />
        </div>
      ) : (
        <div className={styles.speciesDeleteField}></div>
      )}
    </div>
  );
}

interface Props {
  handleNext: () => void;
  userLang: string;
  setIntervention: SetState<Intervention | null>;
  geoJson: Geometry | null;
  setGeoJson: Function;
  activeMethod: string;
  setActiveMethod: Function;
}

type PlantingLocationApiPayload = {
  type: string;
  captureMode: string;
  geometry: Geometry;
  plantedSpecies: SpeciesFormData[];
  plantDate: string;
  registrationDate: string;
  plantProject: string;
};

export default function PlantingLocation({
  handleNext,
  userLang,
  setIntervention,
  geoJson,
  setGeoJson,
  activeMethod,
  setActiveMethod,
}: Props): ReactElement {
  const { getApiAuthenticated } = useApi();
  const { postApiAuthenticated } = useApi();
  const tTreemapper = useTranslations('Treemapper');
  const tMe = useTranslations('Me');
  const tMaps = useTranslations('Maps');
  // local state
  const [isUploadingData, setIsUploadingData] = useState(false);
  const [projects, setProjects] = useState<ProfileProjectFeature[]>([]);
  const importMethods = ['import', 'editor'];
  const [geoJsonError, setGeoJsonError] = useState(false);
  const [mySpecies, setMySpecies] = useState<Species[] | null>(null);
  // store: state
  const isTpo = useUserStore((state) => state.userProfile?.type === 'tpo');
  const isAuthResolved = useAuthStore((state) => state.isAuthResolved);
  // store: action
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  const defaultValues = {
    plantDate: '',
    plantProject: '',
    geometry: {},
    plantedSpecies: [
      {
        otherSpecies: '',
        treeCount: 0,
      },
    ],
  };
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<InterventionFormData>({
    mode: 'onBlur',
    defaultValues: defaultValues,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'plantedSpecies',
  });

  const loadProjects = async () => {
    try {
      const projects = await getApiAuthenticated<ProfileProjectFeature[]>(
        '/app/profile/projects'
      );
      setProjects(projects);
    } catch (err) {
      setErrors(handleError(err as APIError));
    }
  };

  const loadMySpecies = async () => {
    try {
      const species = await getApiAuthenticated<Species[]>(
        '/treemapper/species'
      );
      setMySpecies(species);
    } catch (err) {
      setErrors(handleError(err as APIError));
    }
  };

  useEffect(() => {
    if (isAuthResolved) {
      loadProjects();
      loadMySpecies();
    }
  }, [isAuthResolved]);

  const normalizeGeoJson = (geoJson: GeometryObject | FeatureCollection) => {
    if (
      gjv.isGeoJSONObject(geoJson) &&
      'features' in geoJson &&
      geoJson.features?.length > 0
    ) {
      const flattened = flatten(geoJson);
      if (flattened.features[0]?.geometry?.type === 'Polygon') {
        setGeoJsonError(false);
        setGeoJson(flattened.features[0].geometry);
        setActiveMethod('editor');
      } else {
        setGeoJsonError(true);
      }
    } else if (geoJson?.type && geoJson.type === 'Polygon') {
      setGeoJsonError(false);
      setGeoJson(geoJson);
      setActiveMethod('editor');
    } else {
      setGeoJsonError(true);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file: File) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        const fileType =
          file.name.substring(
            file.name.lastIndexOf('.') + 1,
            file.name.length
          ) || file.name;
        if (fileType === 'kml') {
          reader.readAsText(file);
          reader.onabort = () => console.log('file reading was aborted');
          reader.onerror = () => console.log('file reading has failed');
          reader.onload = (event) => {
            const result = event.target?.result;
            if (typeof result !== 'string') return;
            const dom = new DOMParser().parseFromString(result, 'text/xml');
            const geo = tj.kml(dom);
            if (gjv.isGeoJSONObject(geo) && geo.features.length !== 0) {
              const flattened = flatten(geo);
              if (flattened.features[0].geometry.type === 'Polygon') {
                setGeoJsonError(false);
                setGeoJson(flattened.features[0].geometry);
                setActiveMethod('editor');
              } else {
                setGeoJsonError(true);
              }
            } else {
              setGeoJsonError(true);
            }
          };
        } else if (fileType === 'geojson') {
          reader.readAsText(file);
          reader.onabort = () => console.log('file reading was aborted');
          reader.onerror = () => console.log('file reading has failed');
          reader.onload = (event) => {
            const result = event.target?.result;
            if (typeof result === 'string') {
              const geo = JSON.parse(result);
              normalizeGeoJson(geo);
            }
          };
        }
      };
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: ['.geojson', '.kml'],
    multiple: false,
    onDrop: onDrop,
    onDropAccepted: () => {},
    onFileDialogCancel: () => setIsUploadingData(false),
  });

  const onSubmit = async (data: InterventionFormData) => {
    if (geoJson) {
      setIsUploadingData(true);
      const payload: PlantingLocationApiPayload = {
        type: 'multi-tree-registration',
        captureMode: 'external',
        geometry: geoJson,
        plantedSpecies: data.plantedSpecies,
        plantDate: new Date(data.plantDate).toISOString(),
        registrationDate: new Date().toISOString(),
        plantProject: data.plantProject,
      };

      try {
        const res = await postApiAuthenticated<
          Intervention,
          PlantingLocationApiPayload
        >(`/treemapper/interventions`, {
          payload,
        });
        setIntervention(res);
        setIsUploadingData(false);
        handleNext();
      } catch (err) {
        setErrors(handleError(err as APIError));
        setIsUploadingData(false);
      }
    } else {
      setGeoJsonError(true);
    }
  };

  const getMethod = (method: string) => {
    switch (method) {
      case 'import':
        return (
          <>
            <label
              htmlFor="upload"
              className={styles.fileUploadContainer}
              {...getRootProps()}
            >
              <Button variant="contained" color="primary">
                <input {...getInputProps()} />
                {isUploadingData ? (
                  <div className={styles.spinner}></div>
                ) : (
                  tTreemapper('uploadFile')
                )}
              </Button>
              <p style={{ marginTop: '18px' }}>
                {tTreemapper('fileFormatKML')}
              </p>
            </label>
          </>
        );
      case 'editor':
        return (
          <>
            <JSONInput
              id="json-editor"
              placeholder={geoJson}
              onChange={(json: {
                jsObject:
                  | Geometry
                  | FeatureCollection<Geometry, GeoJsonProperties>;
              }) => normalizeGeoJson(json.jsObject)}
              locale={locale}
              height="220px"
              width="100%"
            />
          </>
        );
      // case 'draw':
      //   return (
      //     <div className={styles.drawMapText}>draw on map on the right</div>
      //   );
      default:
        return null;
    }
  };

  return (
    <>
      <div className={styles.formField}>
        <div className={styles.formFieldLarge}>
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
              rules={{ required: tTreemapper('datePlantedRequired') }}
              render={({ field: { onChange, value } }) => (
                <MuiDatePicker
                  label={tMe('datePlanted')}
                  value={value}
                  onChange={onChange}
                  renderInput={(props) => <TextField {...props} />}
                  disableFuture
                  inputFormat="MMMM d, yyyy"
                />
              )}
            />
          </LocalizationProvider>
          {errors.plantDate && (
            <span className={styles.errorMessage}>
              {errors.plantDate.message}
            </span>
          )}
        </div>
      </div>

      {isTpo && (
        <div className={styles.formFieldLarge}>
          <Controller
            name="plantProject"
            control={control}
            rules={{
              required: tTreemapper('projectRequired'),
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextField
                label={tMe('project')}
                variant="outlined"
                select
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.plantProject !== undefined}
                helperText={errors.plantProject && errors.plantProject.message}
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
        </div>
      )}
      <div className={styles.formFieldLarge}>
        <div className={styles.importTabs}>
          {importMethods.map((method, index) => (
            <Button
              key={index}
              onClick={() => setActiveMethod(method)}
              className={styles.importTab}
              variant="contained"
              color={activeMethod === method ? 'primary' : 'inherit'}
            >
              {tTreemapper(method)}
            </Button>
          ))}
        </div>
        {getMethod(activeMethod)}
        <div className={styles.errorMessage}>
          {geoJsonError && tTreemapper('geoJsonError')}
        </div>
      </div>
      <div className={styles.formSubTitle}>{tMaps('speciesPlanted')}</div>
      {mySpecies &&
        fields.map((item, index) => {
          return (
            <PlantedSpecies
              // Use id instead of index to prevent rerenders as per rhf guidelines
              key={item.id}
              index={index}
              remove={remove}
              errors={errors}
              item={item}
              control={control}
            />
          );
        })}
      <div
        onClick={() => {
          append({
            otherSpecies: '',
            treeCount: 0,
          });
        }}
        className={styles.addSpeciesButton}
      >
        {tTreemapper('addAnotherSpecies')}
      </div>

      <div className={styles.formFieldLarge}>
        <Button
          id={'basicDetailsCont'}
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          color="primary"
        >
          {isUploadingData ? (
            <div className={styles.spinner}></div>
          ) : (
            tTreemapper('continue')
          )}
        </Button>
      </div>
      {/* <DevTool control={control} /> */}
    </>
  );
}
