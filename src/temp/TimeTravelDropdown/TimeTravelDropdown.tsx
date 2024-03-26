import React, { useState } from 'react';
import styles from './Dropdown.module.scss';
import CalendarIcon from '../icons/CalendarIcon';
import DropdownArrow from '../icons/DropdownArrow';

interface TimeTravelDropdownProps {
  labelYear: string;
  labelSource: string;
  yearList: string[];
  sourceList: string[];
  isOpen: boolean;
}

const TimeTravelDropdown = ({
  labelYear,
  labelSource,
  yearList,
  sourceList,
  isOpen,
}: TimeTravelDropdownProps) => {
  const [selectedYear, setSelectedYear] = useState(labelYear);
  const [selectedSource, setSelectedSource] = useState(labelSource);
  const [isMenuOpen, setIsMenuOpen] = useState(isOpen);
  const handleChangeYear = (year: string) => {
    setSelectedYear(year);
  };

  const handleChangeSource = (source: string) => {
    setSelectedSource(source);
  };

  const styleForSelectedOption = (
    selectedOption: string,
    labelValue: string
  ) => {
    if (selectedOption.toLowerCase() === labelValue.toLowerCase()) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className={styles.menuContainer}>
      <button
        className={styles.menuButton}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div className={styles.menuButtonTitle}>
          <CalendarIcon width={14} color={`${'var(--bold-font-color-new)'}`} />
          <p>
            <span>{selectedYear} </span>via {selectedSource}
          </p>
        </div>
        <DropdownArrow width={8} color={`${'var(--bold-font-color-new)'}`} />
      </button>
      {isMenuOpen && (
        <div className={styles.menuItems}>
          <ul className={styles.yearMenuContainer}>
            {yearList?.map((year, index) => (
              <time
                key={index}
                onClick={() => handleChangeYear(year)}
                className={`${
                  styleForSelectedOption(year, selectedYear)
                    ? styles.selectedMenuItem
                    : styles.unselectedMenuItem
                }`}
              >
                {year}
              </time>
            ))}
          </ul>
          <ul className={styles.sourceMenuContainer}>
            {sourceList?.map((source, index) => (
              <li
                key={index}
                onClick={() => handleChangeSource(source)}
                className={`${
                  styleForSelectedOption(source, selectedSource)
                    ? styles.selectedMenuItem
                    : styles.unselectedMenuItem
                }`}
              >
                {source}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TimeTravelDropdown;