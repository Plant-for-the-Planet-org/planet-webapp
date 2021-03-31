import { Modal } from '@material-ui/core';
import React, { ReactElement } from 'react';
import BackButton from '../../../../../out/assets/images/icons/BackButton';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import styles from '../styles/AccountNavbar.module.scss';

function PaymentRecord({ record, index }) {
  const [selectedRecord, setselectedRecord] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  function selectRecord1(index: any) {
    if (selectedRecord === index) {
      setselectedRecord(null);
      setOpen(false);
    } else {
      setselectedRecord(index);
      setOpen(true);
    }
  }

  function selectRecord2(index: any) {
    if (selectedRecord === index) {
      setselectedRecord(null);
    } else {
      setselectedRecord(index);
    }
  }

  return (
    <div
      key={index}
      className={`${styles.singleRecord} ${
        index === selectedRecord ? styles.selectedRecord : ''
      }`}
    >
      <div className={styles.recordHeader} onClick={() => selectRecord1(index)}>
        <div className={styles.treesDate}>
          <p className={styles.treesDonated}>{record.caption}</p>
          <p className={styles.donationDate}>{formatDate(record.created)}</p>
        </div>
        <div className={styles.statusAmount}>
          {record.amount && record.currency && (
            <div className={styles.recordStatus}>
              {record.currency} {record.amount}
            </div>
          )}
          <div>{record.status}</div>
        </div>
      </div>

      <div
        className={styles.recordHeaderDesktop}
        onClick={() => selectRecord2(index)}
      >
        <div className={styles.treesDate}>
          <p className={styles.treesDonated}>{record.caption}</p>
          <p className={styles.donationDate}>{formatDate(record.created)}</p>
        </div>
        <div className={styles.statusAmount}>
          {record.amount && record.currency && (
            <div className={styles.recordStatus}>
              {record.currency} {record.amount}
            </div>
          )}
          <div>{record.status}</div>
        </div>
      </div>

      <div
        className={`${styles.recordDataContainer} ${
          selectedRecord === index ? styles.recordDataContainerSelected : ''
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
      {/* <div className={styles.borderBottom}></div> */}
      {selectedRecord === index && (
        <Modal
          disableBackdropClick
          hideBackdrop
          className={styles.modal}
          open={open}
          onClose={handleClose}
        >
          <div className={styles.expandedRecord}>
            <div
              onClick={() => {
                selectRecord1(index);
              }}
              className={styles.closeRecord}
            >
              <BackButton style={{}} />
            </div>
            <div className={styles.recordHeader}>
              <div className={styles.treesDate}>
                <p className={styles.treesDonated}>{record.caption}</p>
                <p className={styles.donationDate}>
                  {formatDate(record.created)}
                </p>
              </div>
              <div className={styles.statusAmount}>
                {record.amount && record.currency && (
                  <div className={styles.recordStatus}>
                    {record.currency} {record.amount}
                  </div>
                )}
                <div>{record.status}</div>
              </div>
            </div>
            <div className={styles.recordContainer}>
              {record.details &&
                record.details.length > 0 &&
                record.details.map((detail: any, index: any) => {
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
        </Modal>
      )}
    </div>
  );
}

export default PaymentRecord;
