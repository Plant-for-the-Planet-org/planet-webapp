import type { ReactNode } from 'react';

import { useMemo } from 'react';
import getGlobalStyles from '../../../theme/theme';
import { useTheme } from '../../../theme/themeContext';
import AuthFailed from '../ErrorComponents/AuthFailed';
import CookiePolicy from './CookiePolicy';
import ErrorPopup from './ErrorPopup';
import Header from './Header';
import Navbar from './Navbar';
import {
  useAuthStore,
  useQueryParamStore,
  useTenantStore,
  useViewStore,
} from '../../../stores';
import { isEmbeddablePage } from '../../../stores/viewStore';

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

  // The profile fetch runs globally, so a sign-in can fail on any page. Swapping the content here reaches the user wherever they are, with no redirect.
  const hasAuthFailed = useAuthStore((state) => state.hasAuthFailed);

  return (
    <>
      <Header />
      <style>{globalStyles}</style>
      <div className={themeType}>
        {!isEmbedMode && <Navbar />}
        <div>{hasAuthFailed ? <AuthFailed /> : children}</div>

        <div>
          <div className="notificationContainer">
            {!isEmbedMode && <CookiePolicy />}

            <ErrorPopup />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
