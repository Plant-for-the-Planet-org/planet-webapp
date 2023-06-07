import React from 'react';
import styles from '../../styles/MyTrees.module.scss';
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
  PlantedTreesSvg,
  ConservationTreeSvg,
  ArrowSvg,
  ProjectsSvg,
  CountriesSvg,
  DonationsSvg,
  EditTargetSvg,
} from '../../../../../../public/assets/images/ProfilePageIcons';
import TreeCounter from '../../../../common/TreeCounter/TreeCounter';
import Button from '@mui/material/Button/Button';

const MyTreesMap = dynamic(() => import('./MyTreesMap'), {
  loading: () => <p>loading</p>,
});

interface Props {
  profile: any;
  authenticatedType: any;
  token: any;
}

const PlantedTreesAndRestorationInfo = () => {
  const { t } = useTranslation(['donate']);
  return (
    <div style={{ display: 'flex', gap: '1px', cursor: 'pointer' }}>
      <div
        style={{
          display: 'flex',
          position: 'relative',
          width: '183.5px',
          height: '104px',
          backgroundColor: '#219653',
          borderBottomLeftRadius: '12px',
          borderTopLeftRadius: '12px',
        }}
      >
        <div style={{ position: 'absolute', top: '24px', left: '22px' }}>
          <PlantedTreesSvg />
        </div>
        <div
          style={{
            position: 'absolute',
            left: '45px',
            top: '20px',
            fontSize: '16px',
            fontWeight: '700',
            color: '#FFFFFF',
          }}
        >
          {t('donate:plantedTrees')}
        </div>

        <div
          style={{
            position: 'absolute',
            top: '44px',
            left: '20px',
            fontWeight: 'bold',
            fontSize: '36px',
            color: '#FFFFFF',
          }}
        >
          34
        </div>
      </div>
      <div
        style={{
          width: '183.5px',
          height: '104px',
          backgroundColor: '#219653',
          borderBottomRightRadius: '12px',
          borderTopRightRadius: '12px',
          fontSize: '16px',
          fontWeight: '700',
          color: '#FFFFFF',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '232px',
            top: '20px',
          }}
        >
          {t('donate:restored')}
        </div>
      </div>
    </div>
  );
};

const ConservedAreaInfo = () => {
  const { t } = useTranslation(['donate']);
  return (
    <div
      style={{
        position: 'relative',
        width: '189px',
        height: '104px',
        backgroundColor: '#FFFFFF99',
        borderRadius: '12px',
        cursor: 'pointer',
      }}
    >
      <div>
        <div
          style={{
            display: 'flex',
          }}
        >
          <div style={{ position: 'absolute', top: '22px', left: '24px' }}>
            <ConservationTreeSvg />
          </div>
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '45px',
              fontWeight: '700',
              fontSize: '16px',
            }}
          >
            {t('donate:conservation')}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <div style={{ position: 'absolute', left: '136px', top: '64px' }}>
            <ArrowSvg />
          </div>
        </div>
      </div>
    </div>
  );
};

const OtherContributionInfo = () => {
  const { t } = useTranslation(['maps', 'me']);
  return (
    <div style={{ display: 'flex', gap: '12px', cursor: 'pointer' }}>
      <div
        style={{
          position: 'relative',
          width: '134px',
          height: '104px',
          backgroundColor: '#2196531A',
          borderRadius: '12px',
        }}
      >
        <div style={{ display: 'flex' }}>
          <div style={{ position: 'absolute', left: '22px', top: '22px' }}>
            <ProjectsSvg />
          </div>
          <div
            style={{
              position: 'absolute',
              left: '45px',
              top: '20px',
              fontWeight: '700',
              fontSize: '16px',
            }}
          >
            {t('maps:projects')}
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            fontWeight: 'bold',
            fontSize: '36px',
            top: '44px',
            left: '20px',
          }}
        >
          12
        </div>
      </div>
      <div
        style={{
          width: '147px',
          height: '104px',
          backgroundColor: '#2196531A',
          borderRadius: '12px',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex' }}>
          <div style={{ position: 'absolute', left: '22px', top: '22px' }}>
            <CountriesSvg />
          </div>
          <div
            style={{
              position: 'absolute',
              left: '45px',
              top: '20px',
              fontWeight: '700',
              fontSize: '16px',
            }}
          >
            {t('maps:countries')}
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            fontWeight: 'bold',
            fontSize: '36px',
            top: '44px',
            left: '20px',
          }}
        >
          12
        </div>
      </div>
      <div
        style={{
          width: '152px',
          height: '104px',
          backgroundColor: '#2196531A',
          borderRadius: '12px',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex' }}>
          <div style={{ position: 'absolute', left: '22px', top: '22px' }}>
            <DonationsSvg />
          </div>
          <div
            style={{
              position: 'absolute',
              left: '45px',
              top: '20px',
              fontWeight: '700',
              fontSize: '16px',
            }}
          >
            {t('me:donations')}
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            fontWeight: 'bold',
            fontSize: '36px',
            top: '44px',
            left: '20px',
          }}
        >
          12
        </div>
      </div>
    </div>
  );
};

const TreeCount = (props) => {
  const { t } = useTranslation(['me']);
  const [addTargetModalOpen, setAddTargetModalOpen] = React.useState(false);
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '1098px',
        paddingLeft: '50px',
        paddingRight: '50px',
        marginTop: '100px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{ backgroundColor: '#27AE601A', height: '450px', width: '100%' }}
      ></div>
      <div className={styles.treeCounterBackground}></div>
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          width: '400px',
          height: '400px',
          top: '75px',
          left: '410px',
        }}
      >
        {' '}
        {props?.userprofile && (
          <TreeCounter
            handleAddTargetModalOpen={() => {
              setAddTargetModalOpen(true);
            }}
            authenticatedType={props.authenticatedType}
            target={props.userprofile?.score?.target}
            planted={
              props.userprofile?.type === 'tpo'
                ? props.userprofile?.score.personal
                : props.userprofile?.score.personal +
                  props.userprofile?.score.received
            }
          />
        )}
      </div>
    </div>
  );
};
export default function MyTrees({ profile, authenticatedType, token }: Props) {
  const { ready } = useTranslation(['country', 'me']);
  const [contributions, setContributions] = React.useState();
  const { setErrors, redirect } = React.useContext(ErrorHandlingContext);
  const { logoutUser } = useUserProps();

  React.useEffect(() => {
    async function loadFunction() {
      if (authenticatedType === 'private' && token) {
        try {
          const result = await getAuthenticatedRequest(
            `/app/profile/contributions`,
            token,
            logoutUser
          );
          setContributions(result);
        } catch (err) {
          setErrors(handleError(err as APIError));
          redirect('/profile');
        }
      } else {
        try {
          const result = await getRequest(
            `/app/profiles/${profile.id}/contributions`
          );
          setContributions(result);
        } catch (err) {
          setErrors(handleError(err as APIError));
        }
      }
    }
    loadFunction();
  }, [profile]);

  const MapProps = {
    contributions,
    authenticatedType,
  };
  console.log(profile);
  return contributions?.length > 0 && ready ? (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <MyTreesMap />
      <div
        style={{
          width: '100%',
          position: 'absolute',
          top: '510px',
          left: '65px',
          display: 'flex',
          gap: '12px',
        }}
      >
        <PlantedTreesAndRestorationInfo />
        <ConservedAreaInfo />
        <OtherContributionInfo />
      </div>
      <TreeCount userprofile={profile} authenticatedType={authenticatedType} />
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
