import React, { useState } from 'react';
import styles from './Dropdown.module.scss';
import CalendarIcon from '../icons/CalendarIcon';
import DropdownArrow from '../icons/DropdownArrow';

const TimeTravelDropdown = ({
  labelYear,
  labelSource,
  yearList,
  sourceList,
  isOpen,
}) => {
  const [selectedYear, setSelectedYear] = useState(labelYear);
  const [selectedSource, setSelectedSource] = useState(labelSource);
  const [isMenuOpen, setIsMenuOpen] = useState(isOpen);
  const handleChangeYear = (year: string) => {
    setSelectedYear(year);
  };

  const handleChangeSource = (source: string) => {
    setSelectedSource(source);
  };

  const styleForSelectedOption = (selectedOption, labelValue) => {
    const isEqual =
      typeof labelValue === 'string'
        ? selectedOption.toLowerCase() === labelValue.toLowerCase()
        : selectedOption === labelValue;
    if (isEqual) {
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
        <CalendarIcon />
        <p>
          <span>{selectedYear} </span>via {selectedSource}
        </p>
        <DropdownArrow />
      </div>
      {isMenuOpen && (
        <div className={styles.menuItems}>
          <ul className={styles.yearMenuContainer}>
            {yearList?.map((year, index) => (
              <li
                key={index}
                onClick={() => handleChangeYear(year)}
                style={styleForSelectedOption(year, labelYear)}
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
