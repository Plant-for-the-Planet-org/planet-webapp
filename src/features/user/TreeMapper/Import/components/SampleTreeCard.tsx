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

const { useTranslation } = i18next;

interface Props {
  index: number;
  register: Function;
  remove: Function;
  getValues: Function;
  control:any;
  userLang:string;
}

export default function SampleTreeCard({
  index,
  register,
  remove,
  getValues,
  control,
  userLang
}: Props): ReactElement {
  const sampleTrees = getValues();
  const { t, ready } = useTranslation(['treemapper', 'common']);
  return (
    <div key={index} className={styles.sampleTreeFieldGroup}>
      <div className={styles.sampleTreeName}>
        <div>
        {t('sampleTree', { number: index + 1 })}
        {`${
          sampleTrees[index]?.treeTag
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
                render={(properties:any) => (
                  <DatePicker
                    label={t('me:plantingDate')}
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
              inputRef={register({})}
              label={t('me:treeTag')}
              variant="outlined"
              name={`sampleTrees[${index}].treeTag`}
            />
</div>
          
        </div>
        <div className={styles.formField}>
        <div className={styles.formFieldHalf}>
            <MaterialTextField
              inputRef={register({
                required: {
                  value: true,
                  message: t('me:heightRequired'),
                },
                validate: (value: any) => parseInt(value, 10) >= 1,
              })}
              onInput={(e: any) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
              }}
              label={t('me:height')}
              variant="outlined"
              name={`sampleTrees[${index}].height`}
            />
          </div>
          <div className={styles.formFieldHalf}>
            <MaterialTextField
              inputRef={register({
                required: {
                  value: true,
                  message: t('me:diameterRequired'),
                },
                validate: (value: any) => parseInt(value, 10) >= 1,
              })}
              onInput={(e: any) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
              }}
              label={t('me:diameter')}
              variant="outlined"
              name={`sampleTrees[${index}].diameter`}
            />
          </div>
        </div>

        <div className={styles.formField}>
        <div className={styles.formFieldHalf}>
            <MaterialTextField
              inputRef={register({
                required: {
                  value: true,
                  message: t('me:latitudeRequired'),
                },
                validate: (value: any) => parseInt(value, 10) >= 1,
              })}
              onInput={(e: any) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
              }}
              label={t('me:latitude')}
              variant="outlined"
              name={`sampleTrees[${index}].latitude`}
            />
          </div>
          <div className={styles.formFieldHalf}>
            <MaterialTextField
              inputRef={register({
                required: {
                  value: true,
                  message: t('me:longitudeRequired'),
                },
                validate: (value: any) => parseInt(value, 10) >= 1,
              })}
              onInput={(e: any) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
              }}
              label={t('me:longitude')}
              variant="outlined"
              name={`sampleTrees[${index}].longitude`}
            />
          </div>
        </div>
        <div className={styles.formFieldLarge}>
        <MaterialTextField
              inputRef={register({
                required: {
                  value: true,
                  message: t('me:speciesIsRequired'),
                },
              })}
              label={t('me:treeSpecies')}
              variant="outlined"
              name={`sampleTrees[${index}].species`}
            />
        </div>
      </div>
    </div>
  );
}
