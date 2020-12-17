import React from 'react';
import theme from '../../../theme/theme';
import { useTheme } from '../../../theme/themeContext';
import CookiePolicy from './CookiePolicy';
import Header from './Header';
import Navbar from './Navbar';
import PlanetPopup from './PlanetPopup';
import RedeemPopup from './RedeemPopup';

export default function Layout(props: any) {
  const { theme: themeType } = useTheme();
  return (
    <>
      <Header />
      <style jsx global>
        {theme}
      </style>
      <div className={`${themeType}`}>
        <Navbar theme={themeType} />
        {props.children}
        <CookiePolicy />
        <RedeemPopup />
        <PlanetPopup />
      </div>
    </>
  );
}
