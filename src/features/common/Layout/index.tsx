import { useRouter } from 'next/router';
import React from 'react';
import theme from '../../../theme/theme';
import { useTheme } from '../../../theme/themeContext';
import CookiePolicy from './CookiePolicy';
import ErrorPopup from './ErrorPopup';
import Header from './Header';
import Navbar from './Navbar';
import RedeemPopup from './RedeemPopup';
import { ParamsContext } from './QueryParamsContext';

export default function Layout(props: any) {
  const { theme: themeType } = useTheme();
  const { embed } = React.useContext( ParamsContext );
  
  return (
    <>
      <Header />
      <style jsx global>
        {theme}
      </style>
      <div className={`${themeType}`}>
        <Navbar theme={themeType} />
        <div>
          {props.children}
        </div>

        <div>
          <div className={'notificationContainer'}>
            { embed === 'true' ? null :
            <>
            <CookiePolicy />
            <RedeemPopup />
            </>
            }
            <ErrorPopup />
          </div>
        </div>


      </div>
    </>
  );
}
