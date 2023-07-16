import React, { useEffect, useContext } from 'react';
import myForestStyles from '../../../ProfileV2/styles/MyForest.module.scss';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import { handleError, APIError } from '@planet-sdk/common';
import PlantedTreesButton from '../../../ProfileV2/components/PlantedTreesButton';
import ConservationButton from '../../../ProfileV2/components/ConservationButton';
import DonationInfo from '../../../ProfileV2/components/DonationInfo';
import TreeContributedProjectList from '../../../ProfileV2/components/TreeContributedProjectList';
import { trpc } from '../../../../../utils/trpc';
import AreaConservedProjectList from '../../../ProfileV2/components/AreaConservedProjectList';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { ProjectPropsContext } from '../../../../common/Layout/ProjectPropsContext';

const MyTreesMap = dynamic(
  () => import('../../../ProfileV2/components/MyForestMap'),
  {
    loading: () => <p>loading</p>,
  }
);

interface Props {
  profile: any;
  authenticatedType: any;
  token: any;
}

export default function MyTrees({ profile, authenticatedType, token }: Props) {
  const { ready } = useTranslation(['country', 'me']);
  const [contributions, setContributions] = React.useState();
  const { logoutUser } = useUserProps();
  const [donationOtherInfo, setDonationOtherInfo] = React.useState(undefined);
  const [isTreePlantedButtonActive, setIsTreePlantedButtonActive] =
    React.useState(false);
  const [isConservedButtonActive, setIsConservedButtonActive] =
    React.useState(false);
  const { setErrors, redirect } = React.useContext(ErrorHandlingContext);
  const { conservationProjects, treePlantedProjects } =
    useContext(ProjectPropsContext);
  console.log(conservationProjects, treePlantedProjects, '==0');

  // const detailInfo = trpc.myForest.stats.useQuery({
  //   profileId: `prf_oYOzG6LrTeFkhtEomszwODcP`,
  // });

  // const contributionData = trpc.myForest.contributionsGeoJson.useQuery({
  //   profileId:,
  //   purpose: 'trees',
  // });

  // React.useEffect(() => {
  //   if (!contributionData.isLoading) {
  //     if (contributionData.error) {
  //       setErrors(
  //         handleError(
  //           new APIError(
  //             contributionData.error?.data?.httpStatus as number,
  //             contributionData.error
  //           )
  //         )
  //       );
  //     } else {
  //       setContributions(contributionData.data);
  //     }
  //     console.log('==>', contributionData.data);
  //   }
  // }, [contributionData.isLoading]);

  // React.useEffect(() => {
  //   if (!detailInfo.isLoading) {
  //     if (detailInfo.error) {
  //       setErrors(
  //         handleError(
  //           new APIError(
  //             detailInfo.error?.data?.httpStatus as number,
  //             detailInfo.error
  //           )
  //         )
  //       );
  //     } else {
  //       console.log('===>', detailInfo.data);
  //       setDonationOtherInfo(detailInfo.data);
  //     }
  //   }
  // }, [detailInfo.isLoading]);
  // // console.log(donationOtherInfo, '==');

  const _dataConserv = [
    {
      type: 'Feature',
      properties: {
        cluster: false,
        category: 'conservation',
        quantity: 1,
        donationIssueDate: null,
        contributionType: 'donation',
        plantProject: {
          guid: '1',
          name: 'Reforestation of our Forests in Germany',
          image: '62f3bac270a37408634575.jpg',
          countryCode: 'DE',
          unit: 'm2',
          location: null,
          tpo: {
            id: 22408,
            guid: 'prf_u9acORF3K14cOnD4UmVZX5mz',
            name: 'Klimahelden (Plant-for-the-Planet e.V.)',
          },
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [73.4445770458133, 26.711311847277106],
      },
    },
    {
      type: 'Feature',
      properties: {
        cluster: false,
        category: 'conservation',
        quantity: 1,
        donationIssueDate: null,
        contributionType: 'donation',
        plantProject: {
          guid: '2',
          name: 'Reforestation of our Forests in Germany',
          image: '62f3bac270a37408634575.jpg',
          countryCode: 'DE',
          unit: 'm2',
          location: null,
          tpo: {
            id: 22408,
            guid: 'prf_u9acORF3K14cOnD4UmVZX5mz',
            name: 'Klimahelden (Plant-for-the-Planet e.V.)',
          },
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [72.4445770458133, 26.711311847277106],
      },
    },
  ];

  const _treePlantedData = [
    {
      type: 'Feature',
      properties: {
        cluster: false,
        category: 'trees',
        quantity: 1,
        donationIssueDate: null,
        contributionType: 'donation',
        plantProject: {
          guid: '1',
          name: 'Reforestation of our Forests in Germany',
          image: '62f3bac270a37408634575.jpg',
          countryCode: 'DE',
          unit: 'm2',
          location: null,
          tpo: {
            id: 22408,
            guid: 'prf_u9acORF3K14cOnD4UmVZX5mz',
            name: 'Klimahelden (Plant-for-the-Planet e.V.)',
          },
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [85.03951524546366, 40.1906804591513],
      },
    },
    {
      type: 'Feature',
      properties: {
        cluster: false,
        category: 'trees',
        quantity: 1,
        donationIssueDate: null,
        contributionType: 'donation',
        plantProject: {
          guid: '2',
          name: 'Reforestation of our Forests in Germany',
          image: '62f3bac270a37408634575.jpg',
          countryCode: 'DE',
          unit: 'm2',
          location: null,
          tpo: {
            id: 22408,
            guid: 'prf_u9acORF3K14cOnD4UmVZX5mz',
            name: 'Klimahelden (Plant-for-the-Planet e.V.)',
          },
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [86.4445770458133, 41.7113118477106],
      },
    },
  ];

  return ready ? (
    <div
      className={myForestStyles.mapMainContainer}
      style={{
        paddingBottom:
          !isTreePlantedButtonActive || !isConservedButtonActive
            ? '110px'
            : '10px',
      }}
    >
      <MyTreesMap
        coservAreaData={_dataConserv}
        treePlantedData={_treePlantedData}
        isTreePlantedButtonActive={isTreePlantedButtonActive}
        isConservedButtonActive={isConservedButtonActive}
      />
      <div className={myForestStyles.mapButtonContainer}>
        <PlantedTreesButton
          plantedTrees={donationOtherInfo?.treeCount}
          isTreePlantedButtonActive={isTreePlantedButtonActive}
          setIsConservedButtonActive={setIsConservedButtonActive}
          setIsTreePlantedButtonActive={setIsTreePlantedButtonActive}
        />
        <div>
          <ConservationButton
            conservedArea={donationOtherInfo?.conserved}
            setIsTreePlantedButtonActive={setIsTreePlantedButtonActive}
            setIsConservedButtonActive={setIsConservedButtonActive}
            isConservedButtonActive={isConservedButtonActive}
          />
        </div>
        <DonationInfo
          projects={donationOtherInfo?.projects}
          countries={donationOtherInfo?.countries}
          donations={donationOtherInfo?.donations}
        />
      </div>

      {isTreePlantedButtonActive && !isConservedButtonActive && (
        <TreeContributedProjectList
          contribution={treePlantedProjects}
          userprofile={profile}
          authenticatedType={authenticatedType}
        />
      )}

      {isConservedButtonActive && !isTreePlantedButtonActive && (
        <AreaConservedProjectList
          contribution={conservationProjects}
          isConservedButtonActive={isConservedButtonActive}
        />
      )}
    </div>
  ) : null;
}
