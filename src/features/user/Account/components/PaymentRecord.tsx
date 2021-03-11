import React, { ReactElement } from 'react';
import styles from '../styles/AccountNavbar.module.scss';

function PaymentRecord({ record, index }) {
  const [selectedRecord, setselectedRecord] = React.useState(null);

  function selectRecord(index: any) {
    if (selectedRecord === index) {
      setselectedRecord(null);
    } else {
      setselectedRecord(index);
    }
  }
  return (
    <div key={index} className={styles.singleRecord}>
      <div className={styles.recordHeader} onClick={() => selectRecord(index)}>
        <div className={styles.treesDate}>
          <p className={styles.treesDonated}>{record.caption}</p>
          <p className={styles.donationDate}>{record.created}</p>
        </div>
        <div className={styles.statusAmount}>
          {record.amount && record.currency && (
            <div className={styles.recordStatus}>
              {record.currency} {record.amount}
            </div>
          )}
          <div className={styles.recordStatus}>{record.status}</div>
        </div>
      </div>

      <div
        className={`${styles.recordDataContainer} ${
          selectedRecord === index
            ? styles.recordDataContainerSelected
            : ''
        }`}
      >
        {record.details &&
          record.details.length > 0 &&
          record.details.map((detail, index) => {
            return (
              <div key={index} className={styles.detailContainer}>
                <p className={styles.detailTitle}>{detail.caption}</p>
                <div
                  className={styles.detailValue}
                  dangerouslySetInnerHTML={{ __html: detail.text }}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default PaymentRecord;
