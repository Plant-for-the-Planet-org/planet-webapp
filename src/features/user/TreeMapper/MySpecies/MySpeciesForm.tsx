import React from 'react';
import StyledForm from '../../../common/Layout/StyledForm';
import TrashIcon from '../../../../../public/assets/images/icons/manageProjects/Trash';
import {
  deleteAuthenticatedRequest,
  getAuthenticatedRequest,
  postAuthenticatedRequest,
} from '../../../../utils/apiRequests/api';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import SpeciesSelect from './SpeciesAutoComplete';
import styles from './MySpecies.module.scss';
import { useForm, Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { handleError, APIError } from '@planet-sdk/common';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
import { Button, TextField } from '@mui/material';
import {
  Species,
  SpeciesSuggestionType,
} from '../../../common/types/plantLocation';
import { useTenant } from '../../../common/Layout/TenantContext';

interface NewSpecies {
  aliases: string;
  scientificSpecies: SpeciesSuggestionType | null;
}

export default function MySpeciesForm() {
  const tTreemapper = useTranslations('Treemapper');
  const tCommon = useTranslations('Common');
  const { token, contextLoaded, logoutUser } = useUserProps();
  const { setErrors } = React.useContext(ErrorHandlingContext);
  const [species, setSpecies] = React.useState<Species[]>([]);
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const { tenantConfig } = useTenant();

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
      const result = await getAuthenticatedRequest<Species[]>({
        tenant: tenantConfig.id,
        url: '/treemapper/species',
        token,
        logoutUser,
      });
      setSpecies(result);
    } catch (err) {
      setErrors(handleError(err as APIError));
    }
  };

  const deleteSpecies = async (id: string) => {
    try {
      await deleteAuthenticatedRequest(
        tenantConfig.id,
        `/treemapper/species/${id}`,
        token,
        logoutUser
      );
      fetchMySpecies();
    } catch (err) {
      setErrors(handleError(err as APIError));
    }
  };

  const addSpecies = async (species: NewSpecies) => {
    setIsUploadingData(true);
    const data = {
      aliases:
        species.aliases || species.aliases !== ''
          ? species.aliases
          : species.scientificSpecies?.name,
      scientificSpecies: species.scientificSpecies?.id,
    };
    try {
      await postAuthenticatedRequest({
        tenant: tenantConfig.id,
        url: `/treemapper/species`,
        data,
        token,
        logoutUser,
      });
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
    <StyledForm>
      <div className="inputContainer">
        <form onSubmit={handleSubmit(addSpecies)}>
          <InlineFormDisplayGroup>
            <SpeciesSelect
              label={tTreemapper('species')}
              name="scientificSpecies"
              width="300px"
              control={control}
              error={errors.scientificSpecies !== undefined}
              helperText={
                errors.scientificSpecies !== undefined &&
                errors.scientificSpecies.message
              }
            />
            <div>
              <Controller
                name="aliases"
                control={control}
                rules={{ required: tTreemapper('aliasesValidation') }}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    label={tTreemapper('aliases')}
                    type={'text'}
                    style={{ width: '300px' }}
                    variant="outlined"
                    onChange={onChange}
                    value={value}
                    error={errors.aliases !== undefined}
                    helperText={
                      errors.aliases !== undefined && errors.aliases.message
                    }
                  />
                )}
              />
            </div>
            <Button
              id={'addSpecies'}
              onClick={handleSubmit(addSpecies)}
              variant="contained"
              color="primary"
            >
              {isUploadingData ? (
                <div className={styles.spinner}></div>
              ) : (
                tCommon('add')
              )}
            </Button>
          </InlineFormDisplayGroup>
        </form>
        <div className={styles.mySpeciesContainer}>
          {species.map((species: Species) => {
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
    </StyledForm>
  );
}
