'use client';

import { FC, lazy, useEffect, useState } from 'react';
import { useTheme } from '../../../src/theme/themeContext';
import '../../../src/theme/global.scss';

// TODOO - resolve the TS warning for the lazy import statement
const GlobalStyles = lazy(() => import('../../../src/theme/theme'));

const MainLayout: FC = ({ children }) => {
  const { theme } = useTheme();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? (
    <>
      <style>{GlobalStyles}</style>
      <div className={theme}>{children}</div>
    </>
  ) : (
    <></>
  );
};

export default MainLayout;
