import type { SourceName } from '../../../utils/mapsV2/timeTravel';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './TimeTravelDropdown.module.scss';
import CalendarIcon from '../../../../public/assets/images/icons/projectV2/CalendarIcon';
import DropdownUpArrow from '../../../../public/assets/images/icons/projectV2/DropdownUpArrow';
import DropdownDownArrow from '../../../../public/assets/images/icons/projectV2/DropdownDownArrow';

const SOURCE_LABELS = {
  esri: 'Esri',
};

interface TimeTravelDropdownProps {
  defaultYear: string;
  defaultSource: SourceName;
  availableYears: string[];
  availableSources: SourceName[];
  isOpen: boolean;
  onYearChange: (year: string) => void;
  onSourceChange: (source: SourceName) => void;
  customClassName?: string;
}

const TimeTravelDropdown = ({
  defaultYear,
  defaultSource,
  availableYears,
  availableSources,
  isOpen,
  onYearChange,
  onSourceChange,
  customClassName,
}: TimeTravelDropdownProps) => {
  const tTimeTravel = useTranslations('ProjectDetails.timeTravel');

  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [selectedSource, setSelectedSource] = useState(defaultSource);
  const [isMenuOpen, setIsMenuOpen] = useState(isOpen);

  const handleChangeYear = (year: string) => {
    setSelectedYear(year);
    onYearChange(year);
  };

  const handleChangeSource = (source: SourceName) => {
    setSelectedSource(source);
    onSourceChange(source);
  };

  const isOptionSelected = (option: string, selectedValue: string): boolean =>
    option.toLowerCase() === selectedValue.toLowerCase();

  return (
    <div className={`${styles.menuContainer} ${customClassName || ''}`}>
      <button
        className={styles.menuButton}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div className={styles.menuButtonTitle}>
          <CalendarIcon width={14} color={`${'var(--bold-font-color-new)'}`} />
          <p className={styles.menuButtonText}>
            {tTimeTravel.rich('sourceAttributionLabel', {
              year: selectedYear,
              source: SOURCE_LABELS[selectedSource],
              highlight: (chunks) => (
                <span className={styles.highlighted}>{chunks}</span>
              ),
            })}
          </p>
        </div>
        {isMenuOpen ? (
          <DropdownUpArrow width={8} />
        ) : (
          <DropdownDownArrow width={10} />
        )}
      </button>
      {isMenuOpen && (
        <div className={styles.menuItems}>
          <ul className={styles.yearMenuContainer}>
            {availableYears?.map((year, index) => (
              <time
                key={index}
                onClick={() => handleChangeYear(year)}
                className={`${
                  isOptionSelected(year, selectedYear)
                    ? styles.selectedMenuItem
                    : styles.unselectedMenuItem
                }`}
              >
                {year}
              </time>
            ))}
          </ul>
          <ul className={styles.sourceMenuContainer}>
            {availableSources?.map((source, index) => (
              <li
                key={index}
                onClick={() => handleChangeSource(source)}
                className={`${
                  isOptionSelected(source, selectedSource)
                    ? styles.selectedMenuItem
                    : styles.unselectedMenuItem
                }`}
              >
                {SOURCE_LABELS[source]}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TimeTravelDropdown;
