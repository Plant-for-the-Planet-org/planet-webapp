import type { ReactNode } from 'react';

import { useMemo } from 'react';
import getGlobalStyles from '../../../theme/theme';
import { useTheme } from '../../../theme/themeContext';
import CookiePolicy from './CookiePolicy';
import ErrorPopup from './ErrorPopup';
import Header from './Header';
import Navbar from './Navbar';
import { useQueryParamStore } from '../../../stores/queryParamStore';
import { useViewStore, isEmbeddablePage } from '../../../stores/viewStore';
import { useTenantStore } from '../../../stores/tenantStore';

const Layout = ({ children }: { children: ReactNode }) => {
  const { theme: themeType } = useTheme();
  const tenantConfig = useTenantStore((state) => state.tenantConfig);
  const globalStyles = useMemo(
    () => getGlobalStyles(tenantConfig?.config?.font),
    [tenantConfig]
  );

  const embed = useQueryParamStore((state) => state.embed);
  const embeddablePage = useViewStore((state) => state.page);
  const isEmbedMode = embed === 'true' && isEmbeddablePage(embeddablePage);

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
