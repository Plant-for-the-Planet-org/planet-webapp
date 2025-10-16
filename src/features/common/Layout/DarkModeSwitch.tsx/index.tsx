import { useContext } from 'react';
import MoonIcon from '../../../../../public/assets/images/footer/MoonIcon';
import SunIcon from '../../../../../public/assets/images/footer/SunIcon';
import { ThemeContext } from '../../../../theme/themeContext';
import styles from './DarkModeSwitch.module.scss';

function DarkModeSwitch() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button style={{ position: 'relative' }}>
      <input
        onClick={() =>
          setTheme(theme === 'theme-light' ? 'theme-dark' : 'theme-light')
        }
        defaultChecked={theme === 'theme-dark' ? true : false}
        type="checkbox"
        className={styles.darkModeCheckbox}
        id="chk"
      />
      <label className={styles.darkModeLabel} htmlFor="chk">
        <MoonIcon />
        <SunIcon />
        <div className={styles.darkModeBall}></div>
      </label>
    </button>
  );
}

export default DarkModeSwitch;
