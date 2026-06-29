import type { ReactNode } from 'react';

import { useMemo } from 'react';
import getGlobalStyles from '../../../theme/theme';
import { useTheme } from '../../../theme/themeContext';
import CookiePolicy from './CookiePolicy';
import ErrorPopup from './ErrorPopup';
import Header from './Header';
import Navbar from './Navbar';
import { useQueryParamStore, useTenantStore } from '../../../stores';

const Layout = ({ children }: { children: ReactNode }) => {
  const { theme: themeType } = useTheme();
  const tenantConfig = useTenantStore((state) => state.tenantConfig);
  const globalStyles = useMemo(
    () => getGlobalStyles(tenantConfig?.config?.font),
    [tenantConfig]
  );

  const isEmbedMode = useQueryParamStore(
    (state) =>
      state.embed === 'true' &&
      (state.page === 'project-list' || state.page === 'project-details')
  );

  return (
    <>
      <Header />
      <style>{globalStyles}</style>
      <div className={themeType}>
        {!isEmbedMode && <Navbar />}
        <div>{children}</div>

        <div>
          <div className="notificationContainer">
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
