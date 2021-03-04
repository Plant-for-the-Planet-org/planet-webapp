import React from 'react';
import styles from '../styles/AccountNavbar.module.scss'

export default function AccountNavbar(props: any) {
  console.log(props)
  return (
    <>
    <div
      className={styles.accountNavbar}
      style={{
        background: `linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.4), rgba(0,0,0,0), rgba(0,0,0,0)), url(${process.env.CDN_URL}/media/images/app/bg_layer.jpg) 0% 0% no-repeat padding-box`,
        mixBlendMode: 'darken',
        backgroundSize: 'cover',
      }}
    >
      <div className={styles.navbarContainer}>
      <p className={styles.nameText}>
        <span className={styles.firstName}>{props.userProfile.firstname} </span> 
        {props.userProfile.lastname}
      </p>
      <p className={styles.secondaryText}>{props.userProfile.score.personal} Trees Planted</p>
      <button id="AccountHistory" className={styles.navbarLink}> Account History </button>
    </div>
    </div>
    </>
  );
}
