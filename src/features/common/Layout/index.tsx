import type { ReactNode } from 'react';

import theme from '../../../theme/theme';
import { useTheme } from '../../../theme/themeContext';
import CookiePolicy from './CookiePolicy';
import ErrorPopup from './ErrorPopup';
import Header from './Header';
import Navbar from './Navbar';
import { useQueryParamStore } from '../../../stores/queryParamStore';

const Layout = ({ children }: { children: ReactNode }) => {
  const { theme: themeType } = useTheme();

  const isEmbeddedContext = useQueryParamStore(
    (state) => state.embed === 'true'
  );
  const page = useQueryParamStore((state) => state.page);

  const isEmbedMode =
    isEmbeddedContext &&
    (page === 'project-list' || page === 'project-details');

  return (
    <>
      <Header />
      <style>{theme}</style>
      <div className={`${themeType}`}>
        {!isEmbedMode && <Navbar />}
        <div>{children}</div>

        <div>
          <div className={'notificationContainer'}>
            {!isEmbedMode && (
              <>
                <CookiePolicy />
                {/* <RedeemPopup /> */}
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
