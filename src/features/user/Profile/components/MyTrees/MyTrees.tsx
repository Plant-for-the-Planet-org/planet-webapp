import React from 'react';
import myForestStyles from '../../../ProfileV2/styles/MyForest.module.scss';
import dynamic from 'next/dynamic';
import {
  getAuthenticatedRequest,
  getRequest,
} from '../../../../../utils/apiRequests/api';
import { useTranslation } from 'next-i18next';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import { handleError, APIError } from '@planet-sdk/common';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import {
  PlantedTreesAndRestorationInfo,
  ConservedAreaInfo,
  OtherDonationInfo,
  AreaPlantedAndRestored,
  AreaConserved,
} from '../../../ProfileV2/components/MyForest';
import { trpc } from '../../../../../utils/trpc';

const MyTreesMap = dynamic(() => import('./MyTreesMap'), {
  loading: () => <p>loading</p>,
});

interface Props {
  profile: any;
  authenticatedType: any;
  token: any;
}

export default function MyTrees({ profile, authenticatedType, token }: Props) {
  const { ready } = useTranslation(['country', 'me']);
  const [contributions, setContributions] = React.useState();
  const [donationOtherInfo, setDonationOtherInfo] = React.useState(undefined);
  const [isTreePlantedButtonActive, setIsTreePlantedButtonActive] =
    React.useState(false);
  const [isConservedButtonActive, setIsConservedButtonActive] =
    React.useState(false);
  const { setErrors, redirect } = React.useContext(ErrorHandlingContext);
  const { logoutUser } = useUserProps();

  // React.useEffect(() => {
  //   async function loadFunction() {
  //     if (authenticatedType === 'private' && token) {
  //       try {
  //         const result = await getAuthenticatedRequest(
  //           `/app/profile/contributions`,
  //           token,
  //           logoutUser
  //         );
  //         setContributions(result);
  //       } catch (err) {
  //         setErrors(handleError(err as APIError));
  //         redirect('/profile');
  //       }
  //     } else {
  //       try {
  //         const result = await getRequest(
  //           `/app/profiles/${profile.id}/contributions`
  //         );
  //         setContributions(result);
  //       } catch (err) {
  //         setErrors(handleError(err as APIError));
  //       }
  //     }
  //   }
  //   loadFunction();
  // }, [profile]);

  // const MapProps = {
  //   contributions,
  //   authenticatedType,
  // };

  const detailInfo = trpc.myForest.stats.useQuery({
    profileId: `prf_oYOzG6LrTeFkhtEomszwODcP`,
  });

  const contributionData = trpc.myForest.contribution.useQuery({
    profileId: `prf_oYOzG6LrTeFkhtEomszwODcP`,
  });

  React.useEffect(() => {
    if (!contributionData.isLoading) {
      if (contributionData.error) {
        setErrors(
          handleError(
            new APIError(
              contributionData.error?.data?.httpStatus as number,
              contributionData.error
            )
          )
        );
      } else {
        setContributions(contributionData.data);
      }
      console.log('==>', contributionData.data);
    }
  }, [contributionData.isLoading]);

  React.useEffect(() => {
    if (!detailInfo.isLoading) {
      if (detailInfo.error) {
        setErrors(
          handleError(
            new APIError(
              detailInfo.error?.data?.httpStatus as number,
              detailInfo.error
            )
          )
        );
      } else {
        console.log('===>', detailInfo.data);
        setDonationOtherInfo(detailInfo.data);
        // console.log(donationOtherInfo);
      }
    }
  }, [detailInfo.isLoading]);

  return donationOtherInfo && contributions && ready ? (
    <div
      className={myForestStyles.mapMainContainer}
      style={{
        paddingBottom:
          !isTreePlantedButtonActive || !isConservedButtonActive
            ? '110px'
            : '10px',
      }}
    >
      <MyTreesMap />
      {/* {console.log(contributions[0].plantProject)} */}
      <div className={myForestStyles.mapButtonContainer}>
        <PlantedTreesAndRestorationInfo
          plantedTrees={donationOtherInfo[0].treeCount}
          isTreePlantedButtonActive={isTreePlantedButtonActive}
          setIsConservedButtonActive={setIsConservedButtonActive}
          setIsTreePlantedButtonActive={setIsTreePlantedButtonActive}
        />
        <div>
          <ConservedAreaInfo
            setIsTreePlantedButtonActive={setIsTreePlantedButtonActive}
            setIsConservedButtonActive={setIsConservedButtonActive}
            isConservedButtonActive={isConservedButtonActive}
          />
        </div>
        <OtherDonationInfo
          projects={donationOtherInfo[0]?.projects}
          countries={donationOtherInfo[0]?.countries}
          donations={donationOtherInfo[0]?.donations}
        />
      </div>
      {isTreePlantedButtonActive && !isConservedButtonActive && (
        <AreaPlantedAndRestored
          contribution={contributions}
          userprofile={profile}
          authenticatedType={authenticatedType}
        />
      )}

      {isConservedButtonActive && !isTreePlantedButtonActive && (
        <AreaConserved isConservedButtonActive={isConservedButtonActive} />
      )}
    </div>
  ) : null;
}

// function TreeList({ contribution }: any) {
//   const date = formatDate(contribution.properties.plantDate);
//   const { t, i18n } = useTranslation(['country', 'me']);

//   return (
//     <div key={contribution.properties.id} className={styles.tree}>
//       <div className={styles.dateRow}>{date}</div>
//       <div className={styles.treeRow}>
//         <div className={styles.textCol}>
//           <div className={styles.title}>
//             {contribution.properties.type === 'registration'
//               ? t('me:registered')
//               : contribution.properties.project?.name}
//           </div>
//           <div className={styles.country}>
//             {contribution.properties.country
//               ? t('country:' + contribution.properties.country.toLowerCase())
//               : null}
//           </div>
//           {contribution.properties.type === 'gift' ? (
//             <div className={styles.source}>
//               {contribution.properties.giver.name
//                 ? t('me:receivedFrom', {
//                     name: contribution.properties.giver.name,
//                   })
//                 : t('me:receivedTrees')}
//             </div>
//           ) : null}
//           {contribution.properties.type === 'redeem' ? (
//             <div className={styles.source}>{t('me:redeemedTrees')}</div>
//           ) : null}
//           {contribution.properties.type === 'donation' ? (
//             <div className={styles.source}>
//               {contribution.properties.recipient
//                 ? t('me:giftToGiftee', {
//                     gifteeName: contribution.properties.recipient.name,
//                   })
//                 : null}
//             </div>
//           ) : null}
//         </div>
//         <div className={styles.numberCol}>
//           <div className={styles.treeIcon}>
//             <div
//               style={
//                 contribution.properties.type === 'registration'
//                   ? { color: '#3D67B1' }
//                   : {}
//               }
//               className={styles.number}
//             >
//               {getFormattedNumber(
//                 i18n.language,
//                 Number(contribution.properties.treeCount)
//               )}
//             </div>
//             {contribution.properties.treeCount > 1 ? (
//               <TreesIcon
//                 color={
//                   contribution.properties.type === 'registration'
//                     ? '#3D67B1'
//                     : null
//                 }
//               />
//             ) : (
//               <TreeIcon
//                 color={
//                   contribution.properties.type === 'registration'
//                     ? '#3D67B1'
//                     : null
//                 }
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
