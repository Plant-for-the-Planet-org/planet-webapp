import React, { ReactElement } from 'react'
import i18next from '../../../../i18n';
import TrashIcon from '../../../../public/assets/images/icons/manageProjects/Trash';
import { deleteAuthenticatedRequest, getAuthenticatedRequest } from '../../../utils/apiRequests/api';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import styles from './MySpecies.module.scss';

const { useTranslation } = i18next;

interface Props {

}

export default function MySpecies({ }: Props): ReactElement {
    const { t } = useTranslation();
    const { token, contextLoaded } = React.useContext(UserPropsContext);
    const [species, setSpecies] = React.useState<any[]>([]);

    const fetchMySpecies = async () => {
        const result = await getAuthenticatedRequest('/treemapper/species', token);
        console.log(`result`, result)
        setSpecies(result);
    }

    const deleteSpecies = async (id: number) => {
        const result = await deleteAuthenticatedRequest(`/treemapper/species/${id}`, token);
        console.log(`result`, result)
        fetchMySpecies();
    }

    React.useEffect(() => {
        if (contextLoaded && token) {
            fetchMySpecies();
        }
    }, [contextLoaded, token]);

    return (
        <div className="profilePage">
            <h2 className={'profilePageTitle'}>{t('me:mySpecies')}</h2>
            <div className={styles.mySpeciesContainer}>
                {species.map((species: any) => {
                    return (
                        <div key={species.id} className={styles.speciesContainer}>
                            <div className={styles.speciesName}>{species.aliases}</div>
                            <div className={styles.scientificName}>{species.scientificName}</div>
                            <div onClick={() => deleteSpecies(species.id)} className={styles.deleteButton}><TrashIcon /></div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
