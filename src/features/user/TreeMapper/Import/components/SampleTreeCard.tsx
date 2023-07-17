import React, { ReactElement } from 'react';
import MaterialTextField from '../../../../common/InputTypes/MaterialTextField';
import { useTranslation } from 'next-i18next';
import styles from '../Import.module.scss';
import DeleteIcon from '../../../../../../public/assets/images/icons/manageProjects/Delete';
import { Controller } from 'react-hook-form';
import { localeMapForDate } from '../../../../../utils/language/getLanguageName';
import { InputAdornment, MenuItem, SxProps } from '@mui/material';

import { MobileDatePicker as MuiDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import themeProperties from '../../../../../theme/themeProperties';

const dialogSx: SxProps = {
  '& .MuiButtonBase-root.MuiPickersDay-root.Mui-selected': {
    backgroundColor: themeProperties.primaryColor,
    color: '#fff',
  },

  '& .MuiPickersDay-dayWithMargin': {
    '&:hover': {
      backgroundColor: themeProperties.primaryColor,
      color: '#fff',
    },
  },
  '.MuiDialogActions-root': {
    paddingBottom: '12px',
  },
};

interface Props {
  index: number;
  remove: Function;
  getValues: Function;
  control: any;
  userLang: string;
  item: any;
  plantLocation: Treemapper.PlantLocation;
  errors: any;
  key: string;
}

export default function SampleTreeCard({
  index,
  remove,
  getValues,
  control,
  userLang,
  item,
  plantLocation,
  errors,
}: Props): ReactElement {
  const sampleTrees = getValues();
  const { t, ready } = useTranslation(['treemapper', 'common']);
  return (
    <div className={styles.sampleTreeFieldGroup}>
      <div className={styles.sampleTreeName}>
        <div>
          {t('sampleTree', { number: index + 1 })}
          {`${
            sampleTrees[index]?.treeTag
              ? ` • ${t('tag')} ${sampleTrees[index]?.treeTag}`
              : ''
          }`}
        </div>
        <div
          onClick={() => remove(index)}
          style={{
            cursor: 'pointer',
          }}
        >
          <DeleteIcon />
        </div>
      </div>
      <div className={styles.sampleTreeSummary}>
        {`${
          sampleTrees[index]?.height
            ? ` • ${t('height')} ${sampleTrees[index]?.height}`
            : ''
        }`}{' '}
        {`${
          sampleTrees[index]?.diameter
            ? ` • ${t('diameter')} ${sampleTrees[index]?.diameter}`
            : ''
        }`}
      </div>
      <div className={styles.sampleTreeDetails}>
        <div className={styles.formField}>
          <div className={styles.formFieldHalf}>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={
                localeMapForDate[userLang]
                  ? localeMapForDate[userLang]
                  : localeMapForDate['en']
              }
            >
              <Controller
                name={`sampleTrees[${index}].plantingDate`}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <MuiDatePicker
                    label={t('plantingDate')}
                    value={value}
                    onChange={onChange}
                    renderInput={(props) => <MaterialTextField {...props} />}
                    disableFuture
                    inputFormat="MMMM d, yyyy"
                    DialogProps={{
                      sx: dialogSx,
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </div>
          <div className={styles.formFieldHalf}>
            <Controller
              name={`sampleTrees[${index}].treeTag`}
              control={control}
              render={({ field: { onChange, value, onBlur } }) => (
                <MaterialTextField
                  onChange={onChange}
                  value={value}
                  onBlur={onBlur}
                  label={t('treeTag')}
                  variant="outlined"
                />
              )}
            />
          </div>
        </div>
        <div className={styles.formField}>
          <div className={styles.formFieldHalf}>
            <Controller
              name={`sampleTrees[${index}].height`}
              control={control}
              rules={{
                pattern: {
                  value: /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/,
                  message: t('invalidHeight'),
                },
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <MaterialTextField
                  onChange={onChange}
                  value={value}
                  onBlur={onBlur}
                  label={t('height')}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">{t('m')}</InputAdornment>
                    ),
                  }}
                />
              )}
            />
            {errors?.sampleTrees?.[index]?.height && (
              <span className={styles.errorMessage}>
                {errors?.sampleTrees?.[index]?.height?.message}
              </span>
            )}
          </div>
          <div className={styles.formFieldHalf}>
            <Controller
              name={`sampleTrees[${index}].diameter`}
              control={control}
              rules={{
                pattern: {
                  value: /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/,
                  message: t('invalidDiameter'),
                },
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <MaterialTextField
                  onChange={onChange}
                  value={value}
                  onBlur={onBlur}
                  label={t('diameter')}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">{t('cm')}</InputAdornment>
                    ),
                  }}
                />
              )}
            />
            {errors?.sampleTrees?.[index]?.diameter && (
              <span className={styles.errorMessage}>
                {errors?.sampleTrees?.[index]?.diameter?.message}
              </span>
            )}
          </div>
        </div>

        <div className={styles.formField}>
          <div className={styles.formFieldHalf}>
            <Controller
              name={`sampleTrees[${index}].latitude`}
              control={control}
              rules={{
                pattern: {
                  value: /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/,
                  message: t('invalidLatitude'),
                },
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <MaterialTextField
                  onChange={onChange}
                  value={value}
                  onBlur={onBlur}
                  label={t('latitude')}
                  variant="outlined"
                />
              )}
            />
            {errors?.sampleTrees?.[index]?.latitude && (
              <span className={styles.errorMessage}>
                {errors?.sampleTrees?.[index]?.latitude?.message}
              </span>
            )}
          </div>
          <div className={styles.formFieldHalf}>
            <Controller
              name={`sampleTrees[${index}].longitude`}
              control={control}
              rules={{
                pattern: {
                  value: /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/,
                  message: t('invalidLongitude'),
                },
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <MaterialTextField
                  onChange={onChange}
                  value={value}
                  onBlur={onBlur}
                  label={t('longitude')}
                  variant="outlined"
                />
              )}
            />
            {errors?.sampleTrees?.[index]?.longitude && (
              <span className={styles.errorMessage}>
                {errors?.sampleTrees?.[index]?.longitude?.message}
              </span>
            )}
          </div>
        </div>
        <div className={styles.formFieldLarge}>
          <Controller
            name={`sampleTrees[${index}].otherSpecies`}
            control={control}
            render={({ field: { onChange, value, onBlur } }) => (
              <MaterialTextField
                label={t('treeSpecies')}
                variant="outlined"
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                select
              >
                {plantLocation.plantedSpecies.map(
                  (species: Treemapper.PlantedSpecies, index: number) => {
                    if (plantLocation.plantedSpecies.length === 1) {
                      return (
                        <MenuItem
                          key={index}
                          value={species.otherSpecies}
                          selected={true}
                        >
                          {species.otherSpecies}
                        </MenuItem>
                      );
                    } else if (species.otherSpecies === item.otherSpecies) {
                      return (
                        <MenuItem
                          key={index}
                          value={species.otherSpecies}
                          selected={true}
                        >
                          {species.otherSpecies}
                        </MenuItem>
                      );
                    } else {
                      return (
                        <MenuItem key={index} value={species.otherSpecies}>
                          {species.otherSpecies}
                        </MenuItem>
                      );
                    }
                  }
                )}
              </MaterialTextField>
            )}
          />
          {/* <SpeciesSelect label={t('treemapper:species')} name={`scientificSpecies`} width='300px' control={control} /> */}
        </div>
      </div>
    </div>
  );
}
