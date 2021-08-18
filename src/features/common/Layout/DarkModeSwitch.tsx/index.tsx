import React from 'react';
import MoonIcon from '../../../../../public/assets/images/footer/MoonIcon';
import SunIcon from '../../../../../public/assets/images/footer/SunIcon';
import { ThemeContext } from '../../../../theme/themeContext';
import styles from './DarkModeSwitch.module.scss'

function DarkModeSwitch() {
  const { theme, toggleTheme } = React.useContext(ThemeContext);
  const now = new Date();
  const [check, setCheck] = React.useState(false);
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      let tempcheck = document.getElementById("chk")
      setCheck(tempcheck.checked)
      console.log(tempcheck.checked,"temp")
    }
  }, [])
  
  React.useEffect(() => {
    let themeSetter = localStorage.getItem("darkTheme");
    if (themeSetter) {
      themeSetter = JSON.parse(themeSetter)
      if (now.getTime() > themeSetter.expiry) {
        localStorage.removeItem('darkTheme')
        themeSetter = null;
      }
      else {
        toggleTheme(themeSetter.value ? "theme-dark" : "theme-light");
      }
    }
  }, [])

  function storeTheme() {
    const expiryTime = now.getTime() + 86400000; //24hrs time span
    const data = {
      expiry: expiryTime,
      value: check,
    }
    localStorage.setItem('darkTheme', JSON.stringify(data));
  }
console.log(theme === "theme-dark","theme")
  return (
    <button style={{ position: "relative" }}>
      <input
        onClick={(e) => {
          toggleTheme(theme === "theme-light" ? "theme-dark" : "theme-light");
          storeTheme();
          setCheck(e.target.checked)
        }
        }
        value={theme === "theme-dark" ? 1 : 0}
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