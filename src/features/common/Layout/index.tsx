import React from 'react';
import theme from '../../../theme/theme';
import { useTheme } from '../../../theme/themeContext';
import CookiePolicy from './CookiePolicy';
import Header from './Header';
import Navbar from './Navbar';
import RedeemPopup from './RedeemPopup';
import Scroll from './BackToTop/backToTop'
import BackToTop from './BackToTop/backToTop';
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
        <div className={'notificationContainer'}>
          <CookiePolicy />
          <RedeemPopup />
        </div>
        <Scroll />
      </div>
    </>
  );
}
