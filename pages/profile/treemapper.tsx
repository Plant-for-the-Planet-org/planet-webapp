import React, { ReactElement } from 'react';
import i18next from '../../i18n';
import { getAuthenticatedRequest } from '../../src/utils/apiRequests/api';
import TopProgressBar from '../../src/features/common/ContentLoaders/TopProgressBar';
import dynamic from 'next/dynamic';
import { UserPropsContext } from '../../src/features/common/Layout/UserPropsContext';
import UserLayout from '../../src/features/common/Layout/UserLayout/UserLayout';
import TreeMapper from '../../src/features/user/TreeMapper';

const { useTranslation } = i18next;

interface Props {}

const PlantLocationMap = dynamic(
  () => import('../../src/features/user/TreeMapper/components/Map'),
  {
    loading: () => <p>loading</p>,
  }
);

function TreeMapperPage({}: Props): ReactElement {
  const { token, contextLoaded } = React.useContext(UserPropsContext);
  const { t } = useTranslation(['treemapper']);
  const [progress, setProgress] = React.useState(0);
  const [isDataLoading, setIsDataLoading] = React.useState(false);
  const [plantLocations, setPlantLocations] = React.useState(null);
  const [selectedLocation, setselectedLocation] = React.useState('');
  const [location, setLocation] = React.useState(null);
  const [links, setLinks] = React.useState();

  async function fetchTreemapperData(next = false) {
    setIsDataLoading(true);
    setProgress(70);

    if (next && links?.next) {
      const response = await getAuthenticatedRequest(links.next, token);
      if (response) {
        const newPlantLocations = response?.items;
        for (const itr in newPlantLocations) {
          if (Object.prototype.hasOwnProperty.call(newPlantLocations, itr)) {
            const location = newPlantLocations[itr];
            if (location.type === 'multi') {
              newPlantLocations[itr].sampleTrees = [];
              for (const key in newPlantLocations) {
                if (
                  Object.prototype.hasOwnProperty.call(newPlantLocations, key)
                ) {
                  const item = newPlantLocations[key];
                  if (item.type === 'sample') {
                    if (item.parent === location.id) {
                      newPlantLocations[itr].sampleTrees.push(item);
                    }
                  }
                }
              }
            }
          }
        }
        setPlantLocations([...plantLocations, ...newPlantLocations]);
        setLinks(response._links);
      }
    } else {
      const response = await getAuthenticatedRequest(
        '/treemapper/plantLocations?limit=15',
        token
      );
      if (response) {
        const plantLocations = response?.items;
        if (plantLocations?.length === 0) {
          setPlantLocations(null);
        } else {
          for (const itr in plantLocations) {
            if (Object.prototype.hasOwnProperty.call(plantLocations, itr)) {
              const location = plantLocations[itr];
              if (location.type === 'multi') {
                plantLocations[itr].sampleTrees = [];
                for (const key in plantLocations) {
                  if (
                    Object.prototype.hasOwnProperty.call(plantLocations, key)
                  ) {
                    const item = plantLocations[key];
                    if (item.type === 'sample') {
                      if (item.parent === location.id) {
                        plantLocations[itr].sampleTrees.push(item);
                      }
                    }
                  }
                }
              }
            }
          }
          setPlantLocations(plantLocations);
          setLinks(response._links);
        }
      }
    }
    setProgress(100);
    setIsDataLoading(false);
    setTimeout(() => setProgress(0), 1000);
  }

  React.useEffect(() => {
    if (contextLoaded && token) fetchTreemapperData();
  }, [contextLoaded, token]);

  React.useEffect(() => {
    if (selectedLocation !== '') {
      for (const key in plantLocations) {
        if (Object.prototype.hasOwnProperty.call(plantLocations, key)) {
          const plantLocation = plantLocations[key];
          if (selectedLocation === plantLocation.id) {
            setLocation(plantLocation);
            break;
          }
        }
      }
    } else {
      setLocation(null);
    }
  }, [selectedLocation]);

  const TreeMapperProps = {
    location,
    setLocation,
    selectedLocation,
    setselectedLocation,
    plantLocations,
    isDataLoading,
    fetchTreemapperData,
    links,
  };

  return (
    <>
      {progress > 0 && (
        <div className={'topLoader'}>
          <TopProgressBar progress={progress} />
        </div>
      )}

      <UserLayout>
        <TreeMapper/>
      </UserLayout>
    </>
  );
}

export default TreeMapperPage;
