import { Modal } from '@material-ui/core';
import React, { ReactElement } from 'react';
import BackButton from '../../../../../../public/assets/images/icons/BackButton';
import formatDate from '../../../../../utils/countryCurrency/getFormattedDate';
import styles from '../../styles/TreeMapper.module.scss';
import i18next from '../../../../../../i18n';
import Link from 'next/link';
import getFormatedCurrency from '../../../../../utils/countryCurrency/getFormattedCurrency';
import { getFormattedNumber } from '../../../../../utils/getFormattedNumber';
import getImageUrl from '../../../../../utils/getImageURL';

const { useTranslation } = i18next;

interface Props {
  location: Object;
  index: number;
}

function PlantLocation({ location, index }: Props) {
  const { t, i18n } = useTranslation('me');
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
      className={`${styles.singleRecord} ${index === selectedRecord ? styles.selectedRecord : ''
        }`}
    >
      <div className={styles.recordHeader} onClick={() => selectRecord1(index)}>
        <div className={styles.treesDate}>
          <p className={styles.treesDonated}>
            {/* {getFormattedNumber(i18n.language, record.treeCount)}{' '} */}
            1 Tree
            {t(location.type)}
          </p>
          <p className={styles.donationDate}>{formatDate(location.registrationDate)}</p>
        </div>
        <div className={styles.statusAmount}>
          <div className={styles.recordStatus}>
            {t(location.type)}{/* {getFormatedCurrency(i18n.language, record.currency, record.amount)} */}
          </div>
          <div>{location.captureStatus}</div>
        </div>
      </div>

      <div
        className={styles.recordHeaderDesktop}
        onClick={() => selectRecord2(index)}
      >
        <div className={styles.treesDate}>
          <p className={styles.treesDonated}>
            {/* {getFormattedNumber(i18n.language, record.treeCount)}{' '} */}
            {location.type === 'single' ? "1 Tree" : null}
          </p>
          <p className={styles.donationDate}>{formatDate(location.registrationDate)}</p>
        </div>
        <div className={styles.statusAmount}>
          <div className={styles.recordStatus}>
            {t(location.type)}{/* {getFormatedCurrency(i18n.language, record.currency, record.amount)} */}
          </div>
          <div>{t(location.captureStatus)}</div>
        </div>
      </div>

      <div
        className={`${styles.recordDataContainer} ${selectedRecord === index ? styles.recordDataContainerSelected : ''
          }`}
      >
        <div className={styles.imageContainer}>
          {location.coordinates.map((coordinate: any) => {
            const image = getImageUrl('coordinate', 'large', coordinate.image);
            return (
              <img src={image} />
            );
          })}
        </div>
        <div className={styles.recordDetails}>
          <RecordDetails
            location={location}
            t={t}
          />

        </div>
        {/* <div className={styles.recordDownloads}>
          {record.details.donorCertificate &&
            <div className={styles.detail}>
              <Link href={record.details.donorCertificate}>
                <a>{t('donorCertificate')}</a>
              </Link>
            </div>}
          {record.details.recipientCertificate &&
            <div className={styles.detail}>
              <Link href={record.details.recipientCertificate}>
                <a>{t('recipientCertificate')}</a>
              </Link>
            </div>}
          {record.details.taxReceipt &&
            <div className={styles.detail}>
              <Link href={record.details.taxReceipt}>
                <a>{t('taxReceipt')}</a>
              </Link>
            </div>}
        </div> */}
      </div>

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
                <p className={styles.treesDonated}>
                  {location.type === 'single' ? "1 Tree" : null}
                </p>
                <p className={styles.donationDate}>
                  {formatDate(location.registrationDate)}
                </p>
              </div>
              <div className={styles.statusAmount}>
                <div className={styles.recordStatus}>
                  {t(location.type)}
                </div>

                <div>{t(location.captureStatus)}</div>
              </div>
            </div>
            <div className={styles.recordContainer}>
              <RecordDetails
                location={location}
                t={t}
              />
            </div>
            {/* <div className={styles.recordDownloads}>
              {record.details.donorCertificate &&
                <div className={styles.detail}>
                  <Link href={record.details.donorCertificate}>
                    <a>{t('donorCertificate')}</a>
                  </Link>
                </div>}
              {record.details.recipientCertificate &&
                <div className={styles.detail}>
                  <Link href={record.details.recipientCertificate}>
                    <a>{t('recipientCertificate')}</a>
                  </Link>
                </div>}
              {record.details.taxReceipt &&
                <div className={styles.detail}>
                  <Link href={record.details.taxReceipt}>
                    <a>{t('taxReceipt')}</a>
                  </Link>
                </div>}
            </div> */}
          </div>
        </Modal>
      )}
    </div>
  );
}

function RecordDetails({ location, t }: any) {
  return (
    <>
      <div className={styles.detailContainer}>
        <p className={styles.detailTitle}>{t('captureMode')}</p>
        <div className={styles.detailValue}>
          {location.captureMode}
        </div>
      </div>
      <div className={styles.detailContainer}>
        <p className={styles.detailTitle}>{t('captureStatus')}</p>
        <div className={styles.detailValue}>{location.captureStatus}</div>
      </div>
      <div className={styles.detailContainer}>
        <p className={styles.detailTitle}>{t('coordinates')}</p>
        <div className={styles.detailValue}>{location.deviceLocation.coordinates.join(" ")}</div>
      </div>
      <div className={styles.detailContainer}>
        <p className={styles.detailTitle}>{t('guid')}</p>
        <div style={{ wordWrap: 'break-word', paddingRight: 20 }} className={styles.detailValue}>{location.id}</div>
      </div>
      <div className={styles.detailContainer}>
        <p className={styles.detailTitle}>{t('height')}</p>
        <div className={styles.detailValue}>
          {location.measurements.height}
        </div>
      </div>
      <div className={styles.detailContainer}>
        <p className={styles.detailTitle}>{t('width')}</p>
        <div className={styles.detailValue}>
          {location.measurements.width}
        </div>
      </div>
      <div className={styles.detailContainer}>
        <p className={styles.detailTitle}>{t('species')}</p>
        <div className={styles.detailValue}>
          {location.scientificSpecies}
        </div>
      </div>
      <div className={styles.detailContainer}>
        <p className={styles.detailTitle}>{t('plantDate')}</p>
        <div className={styles.detailValue}>
          {formatDate(location.plantDate)}
          {/* {getFormattedNumber(i18n.language, location.treeCount)} */}
        </div>
      </div>
      <div className={styles.detailContainer}>
        <p className={styles.detailTitle}>{t('registrationDate')}</p>
        <div className={styles.detailValue}>
          {formatDate(location.registrationDate)}
        </div>
      </div>
    </>
  );
}

export default PlantLocation;
