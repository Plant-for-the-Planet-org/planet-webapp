import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import styles from '../styles/MyForestItem.module.scss';

export default function MyForestItem({ forest }: any) {
  return (
    <div className={styles.forestItem}>
      {forest.name && <b> {forest.name} </b>}
      {forest.country && <div>{forest.country}</div>}
      {forest.gift && <div> {forest.gift} </div>}
      {forest.date && <div> {forest.date}</div>}
    </div>
  );
}
