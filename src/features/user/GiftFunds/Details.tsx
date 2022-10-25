import styled from '@emotion/styled';
import Grid from '@mui/material/Grid';
import React, { useContext, useEffect } from 'react';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
// import giftFunds from './giftFunds';
import styles from './GiftFunds.module.scss';

const Details = () => {
  const { user } = useContext(UserPropsContext);

  return (
    user.planetCash && (
      <div className={styles.allGiftFundscontainer}>
        {user.planetCash.giftFunds.map((gift, index) => (
          <div className={styles.container} key={index}>
            <div className={styles.container_heading}>
              <b>
                {user.planetCash?.country}/{user.planetCash?.currency} GiftFund
              </b>
            </div>
            <hr />
            <div className={styles.container_details}>
              <div className={styles.project}>
                <b>Project</b>
                <p>{gift.project}</p>
              </div>

              <div className={styles.unit}>
                <b>Available Units</b>
                <p>{Number(gift.openUnits / 100).toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  );
};

export default Details;
