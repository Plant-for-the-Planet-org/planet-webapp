import React, { ReactElement } from 'react';
import TrashIcon from '../../../../public/assets/images/icons/manageProjects/Trash';
import {
  deleteAuthenticatedRequest,
  getAuthenticatedRequest,
  postAuthenticatedRequest,
} from '../../../utils/apiRequests/api';
import MaterialButton from '../../common/InputTypes/MaterialButton';
import MaterialTextField from '../../common/InputTypes/MaterialTextField';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import SpeciesSelect from './Import/components/SpeciesAutoComplete';
import styles from './MySpecies.module.scss';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import { handleError, APIError } from '@planet-sdk/common';

interface Props {}

export default function MySpecies({}: Props): ReactElement {
  const { t } = useTranslation(['treemapper', 'me', 'common']);
  const { token, contextLoaded, logoutUser } = useUserProps();
  const { setErrors } = React.useContext(ErrorHandlingContext);
  const [species, setSpecies] = React.useState<any[]>([]);
  const [isUploadingData, setIsUploadingData] = React.useState(false);

  const defaultMySpeciesValue = {
    aliases: '',
    scientificSpecies: null,
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: defaultMySpeciesValue,
  });

  const fetchMySpecies = async () => {
    try {
      const result = await getAuthenticatedRequest(
        '/treemapper/species',
        token,
        logoutUser
      );
      setSpecies(result);
    } catch (err) {
      setErrors(handleError(err as APIError));
    }
  };

  const deleteSpecies = async (id: number) => {
    try {
      await deleteAuthenticatedRequest(
        `/treemapper/species/${id}`,
        token,
        logoutUser
      );
      fetchMySpecies();
    } catch (err) {
      setErrors(handleError(err as APIError));
    }
  };

  const addSpecies = async (species: any) => {
    setIsUploadingData(true);
    const data = {
      aliases:
        species.aliases || species.aliases !== ''
          ? species.aliases
          : species.scientificSpecies.name,
      scientificSpecies: species.scientificSpecies.id,
    };
    try {
      await postAuthenticatedRequest(
        `/treemapper/species`,
        data,
        token,
        logoutUser
      );
    } catch (err) {
      setErrors(handleError(err as APIError));
    }
    fetchMySpecies();
    setIsUploadingData(false);
  };

  React.useEffect(() => {
    if (contextLoaded && token) {
      fetchMySpecies();
    }
  }, [contextLoaded, token]);

  return (
    <div className="profilePage">
      <h2 className={'profilePageTitle'}>{t('me:mySpecies')}</h2>
      <form onSubmit={handleSubmit(addSpecies)}>
        <div className={styles.addSpecies}>
          <div>
            <SpeciesSelect
              label={t('treemapper:species')}
              name="scientificSpecies"
              width="300px"
              control={control}
            />
            {errors.scientificSpecies && (
              <span className={styles.formError}>
                {errors.scientificSpecies.message}
              </span>
            )}
          </div>
          <div>
            <Controller
              name="aliases"
              control={control}
              rules={{ required: t('treemapper:aliasesValidation') }}
              render={({ field: { onChange, value } }) => (
                <MaterialTextField
                  label={t('treemapper:aliases')}
                  type={'text'}
                  style={{ width: '300px' }}
                  variant="outlined"
                  onChange={onChange}
                  value={value}
                />
              )}
            />
            <div>
              {errors.aliases && (
                <span className={styles.formError}>
                  {errors.aliases.message}
                </span>
              )}
            </div>
          </div>

          <MaterialButton
            id="addSpecies"
            onClick={handleSubmit(addSpecies)}
            width="120px"
          >
            {isUploadingData ? (
              <div className={styles.spinner}></div>
            ) : (
              t('common:add')
            )}
          </MaterialButton>
        </div>
      </form>
      <div className={styles.mySpeciesContainer}>
        {species.map((species: any) => {
          return (
            <div key={species.id} className={styles.speciesContainer}>
              <div className={styles.speciesName}>{species.aliases}</div>
              <div className={styles.scientificName}>
                {species.scientificName}
              </div>
              <div
                onClick={() => deleteSpecies(species.id)}
                className={styles.deleteButton}
              >
                <TrashIcon />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
