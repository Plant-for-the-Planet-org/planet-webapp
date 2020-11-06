import React from 'react';
import styles from '../styles/MyForestItem.module.scss';
import i18next from '../../../../../i18n';

const {useTranslation} = i18next;
export default function MyForestItem({ forest }: any) {
  const {t} = useTranslation(['forest']);
  return (
    <div className={styles.forestItem}>
      {forest.name && <b> {t('forest:forestName', {name: forest.name})} </b>}
      {forest.country && <div>{t('forest:forestCountry', {country: forest.country})}</div>}
      {forest.gift && <div> {t('forest:forestGift', {gift: forest.gift})} </div>}
      {forest.date && <div> {forest.date}</div>}
    </div>
  );
}
