import React from 'react'
import styles from './../styles/StellarForce.module.scss';
import gridStyles from './../styles/Grid.module.scss';
import TreeCounter from '../../TreeCounter/TreeCounter';
import treeCounterStyles from './../styles/TreeCounter.module.scss';
import { getRequest } from '../../../../utils/apiRequests/api';

export default function SingleForce({stellarForce}) {
  const [profile, setprofile] = React.useState(null)
  async function loadPublicUserData() {
    let profile = await getRequest(`/app/profiles/${stellarForce.guid}`);
    setprofile(profile);
  }
  React.useEffect(()=>{
    loadPublicUserData();
  },[])
  
  return profile ? (
    <div key={stellarForce.id} className={`${gridStyles.colSm10} ${gridStyles.colLg6}`}>
      <div className={styles.stellarForceSingleContainer}>
        <div className={styles.treeCounterContainer}>
          <img
            className={styles.treeCounterImage}
            src={stellarForce.imagePath}
            alt={'Image of ' + stellarForce.name}
          />
          <div className={styles.treeCounter}>
            <TreeCounter hideText target={profile.score.target} planted={profile.score.personal + profile.score.received} />
          </div>
        </div>
        {/* <div className={styles.stellarForceImageOverlay}></div> */}
        <div className={styles.stellarForceInfoSection}>
          <h3 className={styles.stellarForceTitle}>{stellarForce.name}</h3>
          {/* <p className={styles.stellarForceDescription}>
                    {stellarForce.stellarForceDescription}
                  </p> */}

          <a href={stellarForce.link} target="_blank" rel="noopener noreferrer">
            <p className={styles.stellarForceLink}>Plant trees</p>
          </a>
        </div>
      </div>
    </div>

  ) : <></>;
}
