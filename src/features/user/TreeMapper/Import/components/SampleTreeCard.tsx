import type { ReactElement } from 'react';
import type { InterventionMulti } from '../../../../common/types/intervention';
import type { SampleTree } from '../../../../common/types/intervention';
import type { Control, FieldArrayWithId, FieldErrors } from 'react-hook-form';

import React from 'react';
import { useTranslations } from 'next-intl';
import styles from '../Import.module.scss';
import DeleteIcon from '../../../../../../public/assets/images/icons/manageProjects/Delete';
import { Controller } from 'react-hook-form';
import { localeMapForDate } from '../../../../../utils/language/getLanguageName';
import { InputAdornment, MenuItem, TextField } from '@mui/material';
import { MobileDatePicker as MuiDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface SampleTreeFormData {
  sampleTrees: SampleTree[];
}

interface Props {
  index: number;
  remove: Function;
  getValues: Function;
  control: Control<SampleTreeFormData>;
  userLang: string;
  item: FieldArrayWithId<SampleTreeFormData, 'sampleTrees', 'id'>;
  intervention: InterventionMulti;
  errors: FieldErrors<SampleTreeFormData>;
  key: string;
}

export default function SampleTreeCard({
  index,
  remove,
  getValues,
  control,
  userLang,
  item,
  intervention,
  errors,
}: Props): ReactElement {
  const sampleTrees = getValues();
  const t = useTranslations('Treemapper');
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
                name={`sampleTrees.${index}.plantingDate`}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <MuiDatePicker
                    label={t('plantingDate')}
                    value={value}
                    onChange={onChange}
                    renderInput={(props) => <TextField {...props} />}
                    disableFuture
                    inputFormat="MMMM d, yyyy"
                  />
                )}
              />
            </LocalizationProvider>
          </div>
          <div className={styles.formFieldHalf}>
            <Controller
              name={`sampleTrees.${index}.treeTag`}
              control={control}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextField
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
              name={`sampleTrees.${index}.height`}
              control={control}
              rules={{
                pattern: {
                  value: /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/,
                  message: t('invalidHeight'),
                },
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextField
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
                  error={errors.sampleTrees?.[index]?.height !== undefined}
                  helperText={errors.sampleTrees?.[index]?.height?.message}
                />
              )}
            />
          </div>
          <div className={styles.formFieldHalf}>
            <Controller
              name={`sampleTrees.${index}.diameter`}
              control={control}
              rules={{
                pattern: {
                  value: /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/,
                  message: t('invalidDiameter'),
                },
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextField
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
                  error={errors.sampleTrees?.[index]?.diameter !== undefined}
                  helperText={errors.sampleTrees?.[index]?.diameter?.message}
                />
              )}
            />
          </div>
        </div>

        <div className={styles.formField}>
          <div className={styles.formFieldHalf}>
            <Controller
              name={`sampleTrees.${index}.latitude`}
              control={control}
              rules={{
                pattern: {
                  value: /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/,
                  message: t('invalidLatitude'),
                },
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextField
                  onChange={onChange}
                  value={value}
                  onBlur={onBlur}
                  label={t('latitude')}
                  variant="outlined"
                  error={errors.sampleTrees?.[index]?.latitude !== undefined}
                  helperText={errors.sampleTrees?.[index]?.latitude?.message}
                />
              )}
            />
          </div>
          <div className={styles.formFieldHalf}>
            <Controller
              name={`sampleTrees.${index}.longitude`}
              control={control}
              rules={{
                pattern: {
                  value: /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/,
                  message: t('invalidLongitude'),
                },
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextField
                  onChange={onChange}
                  value={value}
                  onBlur={onBlur}
                  label={t('longitude')}
                  variant="outlined"
                  error={errors.sampleTrees?.[index]?.longitude !== undefined}
                  helperText={errors.sampleTrees?.[index]?.longitude?.message}
                />
              )}
            />
          </div>
        </div>
        <div className={styles.formFieldLarge}>
          <Controller
            name={`sampleTrees.${index}.otherSpecies`}
            control={control}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextField
                label={t('treeSpecies')}
                variant="outlined"
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                select
              >
                {intervention?.plantedSpecies.map((species, index) => {
                  if (!species.otherSpecies) return;
                  if (intervention?.plantedSpecies.length === 1) {
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
                })}
              </TextField>
            )}
          />
          {/* <SpeciesSelect label={t('treemapper:species')} name={`scientificSpecies`} width='300px' control={control} /> */}
        </div>
      </div>
    </div>
  );
}
