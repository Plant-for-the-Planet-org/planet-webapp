import React, { ReactElement } from 'react';
import i18next from '../../../../i18n';
import TrashIcon from '../../../../public/assets/images/icons/manageProjects/Trash';
import {
  deleteAuthenticatedRequest,
  getAuthenticatedRequest,
  postAuthenticatedRequest,
} from '../../../utils/apiRequests/api';
import MaterialButton from '../../common/InputTypes/MaterialButton';
import MaterialTextField from '../../common/InputTypes/MaterialTextField';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import SpeciesSelect from './Import/components/SpeciesAutoComplete';
import styles from './MySpecies.module.scss';
import { useForm } from 'react-hook-form';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';

const { useTranslation } = i18next;

interface Props {}

export default function MySpecies({}: Props): ReactElement {
  const { t } = useTranslation('treemapper', 'me', 'common');
  const { token, contextLoaded } = React.useContext(UserPropsContext);
  const { handleError } = React.useContext(ErrorHandlingContext);
  const [species, setSpecies] = React.useState<any[]>([]);
  const [isUploadingData, setIsUploadingData] = React.useState(false);

  const { register, handleSubmit, errors, control, getValues } = useForm();

  const fetchMySpecies = async () => {
    const result = await getAuthenticatedRequest('/treemapper/species', token);
    setSpecies(result);
  };

  const deleteSpecies = async (id: number) => {
    const result = await deleteAuthenticatedRequest(
      `/treemapper/species/${id}`,
      token
    );
    fetchMySpecies();
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
    const result = await postAuthenticatedRequest(
      `/treemapper/species`,
      data,
      token,
      handleError
    );
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
          <SpeciesSelect
            label={t('treemapper:species')}
            name={`scientificSpecies`}
            width="300px"
            control={control}
          />
          <MaterialTextField
            label={t('treemapper:aliases')}
            name={`aliases`}
            inputRef={register}
            type={'text'}
            style={{ width: '300px' }}
            variant="outlined"
          />
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
