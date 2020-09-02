import { useTheme } from '../../../utils/themeContext';
import CookiePolicy from '../CookiePolicy';
import Header from '../Header';
import Navbar from '../Navbar';

export default function Layout(props: any) {
  const { theme } = useTheme();
  return (
    <>
      <Header />
      <div className={`${theme}`}>
        <Navbar theme={theme} />
        {props.children}
        <CookiePolicy />
      </div>
    </>
  );
}
