import type { PointFeature } from 'supercluster';
import type {
  MyContributionsSingleRegistration,
  SingleRegistration,
} from '../../../../common/types/myForest';
import type { SetState } from '../../../../common/types/common';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Popup } from 'react-map-gl-v7';
import RegisteredTreePopupIcon from '../../../../../../public/assets/images/icons/myForestMapIcons/RegisteredTreePopupIcon';
import styles from '../ContributionsMap.module.scss';
import formatDate from '../../../../../utils/countryCurrency/getFormattedDate';

type RegisteredTreesInfoProps = {
  registrations: SingleRegistration[];
};
const RegisteredTreesInfo = ({ registrations }: RegisteredTreesInfoProps) => {
  const tProfile = useTranslations('Profile.myForestMap');
  return (
    <>
      {registrations.map((singleRegistration) => {
        const { plantDate, quantity } = singleRegistration;

        return (
          <>
            <div className={styles.registeredTrees}>
              {tProfile('plantedTree', {
                count: quantity,
              })}
            </div>
            <div className={styles.registeredTreeLabel}>
              {tProfile('registered')}
            </div>
            <div className={styles.registeredTreeDate}>
              {formatDate(plantDate)}
            </div>
          </>
        );
      })}
    </>
  );
};
interface RegisteredTreesPopupProps {
  superclusterResponse: PointFeature<MyContributionsSingleRegistration>;
  setIsCursorOnPopup: SetState<boolean>;
}
const RegisteredTreesPopup = ({
  superclusterResponse,
  setIsCursorOnPopup,
}: RegisteredTreesPopupProps) => {
  const { coordinates } = superclusterResponse.geometry;
  const registrations = superclusterResponse.properties.registrations;
  return (
    <Popup
      latitude={coordinates[1]}
      longitude={coordinates[0]}
      className={styles.registeredTreePopup}
      closeButton={false}
    >
      <div
        className={styles.registeredTreesPopupContainer}
        onMouseEnter={() => setIsCursorOnPopup(true)}
        onMouseLeave={() => setIsCursorOnPopup(false)}
      >
        <RegisteredTreePopupIcon />
        <RegisteredTreesInfo registrations={registrations} />
      </div>
    </Popup>
  );
};

export default RegisteredTreesPopup;
