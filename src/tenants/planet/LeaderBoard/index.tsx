import React, { ReactElement } from 'react';
import Footer from '../../../features/common/Layout/Footer';
import Score from './components/Score';
import Stats from './components/Stats';
import Stories from './components/Stories';
import Video from './components/Video';

interface Props {
  leaderboard: any;
}

export default function index({ leaderboard }: Props): ReactElement {
  const blockedCountries = [
    'CK',
    'TH',
    'KW',
    'CN',
    'TL',
    'AF',
    'KH',
    'TW',
    'CY',
    'MM',
    'MO',
    'MN',
    'ID',
    'OM',
    'WS',
    'IQ',
    'SA',
    'IR',
    'SG',
    'QA',
    'MY',
    'FM',
    'BH',
    'AE',
    'BN',
    'TO',
    'YE',
    'HK',
    'JO',
    'LB',
    'MT',
    'LA',
    'PG',
    'VN',
    'LY',
    'SY',
  ];

  let userCountry;
  if (typeof window !== 'undefined') {
    userCountry = localStorage.getItem('countryCode');
  } else {
    userCountry = 'DE';
  }

  return (
    <div>
      <Score leaderboard={leaderboard} />

      <Stats />

      {/* <Stories /> */}

      {!blockedCountries.includes(userCountry) ? <Video /> : null}

      <Footer />
    </div>
  );
}
