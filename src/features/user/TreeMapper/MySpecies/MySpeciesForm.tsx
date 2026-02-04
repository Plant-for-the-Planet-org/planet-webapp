import type { APIError } from '@planet-sdk/common';
import type { Species, SpeciesSuggestionType } from '../Treemapper';

import { useEffect, useState } from 'react';
import StyledForm from '../../../common/Layout/StyledForm';
import TrashIcon from '../../../../../public/assets/images/icons/manageProjects/Trash';
import SpeciesSelect from './SpeciesAutoComplete';
import styles from './MySpecies.module.scss';
import { useForm, Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { handleError } from '@planet-sdk/common';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
import { Button, TextField } from '@mui/material';
import { useApi } from '../../../../hooks/useApi';
import { useAuthStore, useErrorHandlingStore } from '../../../../stores';

interface NewSpecies {
  aliases: string;
  scientificSpecies: SpeciesSuggestionType | null;
}

type SpeciesPayload = {
  aliases: string | null;
  scientificSpecies: string | null;
};

export default function MySpeciesForm() {
  const tTreemapper = useTranslations('Treemapper');
  const tCommon = useTranslations('Common');
  const { getApiAuthenticated, deleteApiAuthenticated, postApiAuthenticated } =
    useApi();
  // local state
  const [species, setSpecies] = useState<Species[]>([]);
  const [isUploadingData, setIsUploadingData] = useState(false);
  // store: state
  const isAuthReady = useAuthStore(
    (state) => state.token !== null && state.isAuthResolved
  );
  // store: action
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

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
      const result = await getApiAuthenticated<Species[]>(
        '/treemapper/species'
      );
      setSpecies(result);
    } catch (err) {
      setErrors(handleError(err as APIError));
    }
  };

  const deleteSpecies = async (id: string) => {
    try {
      await deleteApiAuthenticated(`/treemapper/species/${id}`);
      fetchMySpecies();
    } catch (err) {
      setErrors(handleError(err as APIError));
    }
  };

  const addSpecies = async (species: NewSpecies) => {
    setIsUploadingData(true);
    const payload: SpeciesPayload = {
      aliases:
        (species.aliases || species.aliases !== ''
          ? species.aliases
          : species.scientificSpecies?.name) ?? null,
      scientificSpecies: species.scientificSpecies?.id ?? null,
    };
    try {
      await postApiAuthenticated<Species, SpeciesPayload>(
        `/treemapper/species`,
        {
          payload,
        }
      );
    } catch (err) {
      setErrors(handleError(err as APIError));
    }
    fetchMySpecies();
    setIsUploadingData(false);
  };

  useEffect(() => {
    if (isAuthReady) {
      fetchMySpecies();
    }
  }, [isAuthReady]);
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
