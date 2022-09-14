import React, { FC } from 'react';
import theme from '../../../theme/theme';
import { useTheme } from '../../../theme/themeContext';
import CookiePolicy from './CookiePolicy';
import ErrorPopup from './ErrorPopup';
import Header from './Header';
import Navbar from './Navbar';
import RedeemPopup from './RedeemPopup';
import { ParamsContext } from './QueryParamsContext';

const Layout: FC = ({ children }) => {
  const { theme: themeType } = useTheme();
  const { embed } = React.useContext(ParamsContext);

  const isEmbed = embed === 'true';

  return (
    <>
      <Header />
      <style jsx global>
        {theme}
      </style>
      <div className={`${themeType}`}>
        {!isEmbed && <Navbar theme={themeType} />}
        <div>{children}</div>

        <div>
          <div className={'notificationContainer'}>
            {!isEmbed && (
              <>
                <CookiePolicy />
                <RedeemPopup />
              </>
            )}

            <ErrorPopup />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
