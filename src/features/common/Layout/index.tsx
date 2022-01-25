import React from 'react';
import theme from '../../../theme/theme';
import { useTheme } from '../../../theme/themeContext';
import CookiePolicy from './CookiePolicy';
import ErrorPopup from './ErrorPopup';
import Header from './Header';
import Navbar from './Navbar';
import RedeemPopup from './RedeemPopup';
import tenantConfig from '../../../../tenant.config';

const config = tenantConfig();

export default function Layout(props: any) {
  const { theme: themeType } = useTheme();
  return (
    <>
      <Header />
      <style jsx global>
        {theme}
      </style>
      <div className={`${themeType}`}>
        {config.hideNavbar ? null : <Navbar theme={themeType} />}
        <div>
          {props.children}
        </div>
        <div>
          {config.hideNotifications ? null : (
            <div className={'notificationContainer'}>
              <CookiePolicy />
              <RedeemPopup />
              <ErrorPopup />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
