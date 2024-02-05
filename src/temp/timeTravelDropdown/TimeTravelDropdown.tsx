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
      return {
        fontWeight: 700,
        color: '#333',
      };
    } else {
      return undefined;
    }
  };

  return (
    <div className={styles.menuContainer}>
      <div
        className={styles.menuButton}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div className={styles.menuButtonTitle}>
          <CalendarIcon />
          <p>
            <span>{selectedYear} </span>via {selectedSource}
          </p>
        </div>
        <DropdownArrow />
      </div>
      {isMenuOpen && (
        <div className={styles.menuItems}>
          <ul className={styles.yearMenuContainer}>
            {yearList?.map((year, index) => (
              <li
                key={index}
                onClick={() => handleChangeYear(year)}
                style={styleForSelectedOption(year, selectedYear)}
              >
                {year}
              </li>
            ))}
          </ul>
          <ul className={styles.sourceMenuContainer}>
            {sourceList?.map((source, index) => (
              <li
                key={index}
                onClick={() => handleChangeSource(source)}
                style={styleForSelectedOption(source, selectedSource)}
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
