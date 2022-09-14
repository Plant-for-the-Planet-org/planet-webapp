import React from 'react';
import MoonIcon from '../../../../../public/assets/images/footer/MoonIcon';
import SunIcon from '../../../../../public/assets/images/footer/SunIcon';
import { ThemeContext } from '../../../../theme/themeContext';
import styles from './DarkModeSwitch.module.scss';

function DarkModeSwitch() {
  const { theme, setTheme } = React.useContext(ThemeContext);

  return (
    <button style={{ position: 'relative' }}>
      <input
        onClick={() =>
          setTheme(theme === 'theme-light' ? 'theme-dark' : 'theme-light')
        }
        defaultChecked={theme === 'theme-dark' ? true : false}
        type="checkbox"
        className={styles.darkmodeCheckbox}
        id="chk"
      />
      <label className={styles.darkmodeLabel} htmlFor="chk">
        <MoonIcon />
        <SunIcon />
        <div className={styles.darkmodeBall}></div>
      </label>
    </button>
  );
}

export default DarkModeSwitch;
