import React from 'react';
import styles from './../styles/AboveFooter.module.scss';
import { useTranslation } from 'next-i18next';

export default function LeaderBoardSection() {
  const { ready } = useTranslation();

  return ready ? <div className={styles.aboveFooterSection}></div> : <></>;
}
