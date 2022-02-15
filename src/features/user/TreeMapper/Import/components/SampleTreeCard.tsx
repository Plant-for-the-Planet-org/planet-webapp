import React, { ReactElement } from 'react';
import MaterialTextField from '../../../../common/InputTypes/MaterialTextField';
import i18next from '../../../../../../i18n';
import styles from '../Import.module.scss';
import DeleteIcon from '../../../../../../public/assets/images/icons/manageProjects/Delete';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Controller } from 'react-hook-form';
import DateFnsUtils from '@date-io/date-fns';
import { ThemeProvider } from '@material-ui/styles';
import materialTheme from '../../../../../theme/themeStyles';
import { localeMapForDate } from '../../../../../utils/language/getLanguageName';
import { postRequest } from '../../../../../utils/apiRequests/api';
import SpeciesSelect from './SpeciesAutoComplete';
import { MenuItem, NativeSelect } from '@material-ui/core';
import BootstrapInput, { MaterialInput } from '../../../../common/InputTypes/BootstrapInput';

const { useTranslation } = i18next;

interface Props {
  index: number;
  register: Function;
  remove: Function;
  getValues: Function;
  control: any;
  userLang: string;
  setValue: Function;
  item: any;
  plantLocation: Treemapper.PlantLocation;
}

export default function SampleTreeCard({
  index,
  register,
  remove,
  getValues,
  control,
  userLang,
  setValue,
  item,
  plantLocation,
}: Props): ReactElement {
  const sampleTrees = getValues();
  const { t, ready } = useTranslation(['treemapper', 'common']);

  return (
    <div key={index} className={styles.sampleTreeFieldGroup}>
      <div className={styles.sampleTreeName}>
        <div>
          {t('sampleTree', { number: index + 1 })}
          {`${sampleTrees[index]?.treeTag
            ? ` • ${t('tag')} ${sampleTrees[index]?.treeTag}`
            : ''
            }`}
        </div>
        {index > 0 && (
          <div
            onClick={() => remove(index)}
          >
            <DeleteIcon />
          </div>)
        }
      </div>
      <div className={styles.sampleTreeSummary}>
        {`${sampleTrees[index]?.height
          ? ` • ${t('height')} ${sampleTrees[index]?.height}`
          : ''
          }`}{' '}
        {`${sampleTrees[index]?.diameter
          ? ` • ${t('diameter')} ${sampleTrees[index]?.diameter}`
          : ''
          }`}
      </div>
      <div className={styles.sampleTreeDetails}>
        <div className={styles.formField}>
          <div className={styles.formFieldHalf}>
            <ThemeProvider theme={materialTheme}>
              <MuiPickersUtilsProvider
                utils={DateFnsUtils}
                locale={
                  localeMapForDate[userLang]
                    ? localeMapForDate[userLang]
                    : localeMapForDate['en']
                }
              >
                <Controller
                  defaultValue={item.plantingDate}
                  render={(properties: any) => (
                    <DatePicker
                      label={t('plantingDate')}
                      value={properties.value}
                      onChange={properties.onChange}
                      inputVariant="outlined"
                      TextFieldComponent={MaterialTextField}
                      autoOk
                      disableFuture
                      format="MMMM d, yyyy"
                    />
                  )}
                  name={`sampleTrees[${index}].plantingDate`}
                  control={control}
                />
              </MuiPickersUtilsProvider>
            </ThemeProvider>
          </div>
          <div className={styles.formFieldHalf}>
            <MaterialTextField
              inputRef={register()}
              label={t('treeTag')}
              variant="outlined"
              name={`sampleTrees[${index}].treeTag`}
              defaultValue={item.treeTag}
            />
          </div>

        </div>
        <div className={styles.formField}>
          <div className={styles.formFieldHalf}>
            <MaterialTextField
              inputRef={register()}
              onInput={(e: any) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
              }}
              label={t('height')}
              variant="outlined"
              name={`sampleTrees[${index}].height`}
              defaultValue={item.height}
            />
          </div>
          <div className={styles.formFieldHalf}>
            <MaterialTextField
              inputRef={register()}
              onInput={(e: any) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
              }}
              label={t('diameter')}
              variant="outlined"
              name={`sampleTrees[${index}].diameter`}
              defaultValue={item.diameter}
            />
          </div>
        </div>

        <div className={styles.formField}>
          <div className={styles.formFieldHalf}>
            <MaterialTextField
              inputRef={register()}
              onInput={(e: any) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
              }}
              label={t('latitude')}
              variant="outlined"
              name={`sampleTrees[${index}].latitude`}
              defaultValue={item.latitude}
            />
          </div>
          <div className={styles.formFieldHalf}>
            <MaterialTextField
              inputRef={register()}
              onInput={(e: any) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
              }}
              label={t('longitude')}
              variant="outlined"
              name={`sampleTrees[${index}].longitude`}
              defaultValue={item.longitude}
            />
          </div>
        </div>
        <div className={styles.formFieldLarge}>
          {/* <MaterialTextField
            inputRef={register()}
            label={t('treeSpecies')}
            variant="outlined"
            name={`sampleTrees[${index}].otherSpecies`}
            defaultValue={item.otherSpecies}
          /> */}
          {/* <NativeSelect
            id="sampleTreeSpecies"
            input={<MaterialInput />}
            inputRef={register()}
            name={`sampleTrees[${index}].otherSpecies`}
            defaultValue={item.otherSpecies}
          >
            {plantLocation.plantedSpecies.map((species: Treemapper.PlantedSpecies, index: number) => {
              return (
                <option key={index} value={species.otherSpecies}>
                  {species.otherSpecies}
                </option>
              );
            })}
          </NativeSelect> */}
          <Controller
            as={
              <MaterialTextField
                label={t('treeSpecies')}
                variant="outlined"
                select
                inputRef={register}
              >
                {plantLocation.plantedSpecies.map((species: Treemapper.PlantedSpecies, index: number) => (
                  <MenuItem
                    key={index} value={species.id}
                  >
                    {species.otherSpecies}
                  </MenuItem>
                ))}
              </MaterialTextField>
            }
            name={`sampleTrees[${index}].otherSpecies`}
            defaultValue={item.otherSpecies}
            control={control}
          />
          {/* <SpeciesSelect label={t('treemapper:species')} name={`scientificSpecies`} width='300px' control={control} /> */}
        </div>
      </div>
    </div>
  );
}
