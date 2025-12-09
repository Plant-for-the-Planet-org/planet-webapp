import type { SourceName } from '../../../utils/mapsV2/timeTravel';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import CalendarIcon from '../../../../public/assets/images/icons/projectV2/CalendarIcon';
import DropdownUpArrow from '../../../../public/assets/images/icons/projectV2/DropdownUpArrow';
import DropdownDownArrow from '../../../../public/assets/images/icons/projectV2/DropdownDownArrow';
import themeProperties from '../../../theme/themeProperties';
import styles from './TimeTravelDropdown.module.scss';
import { clsx } from 'clsx';

const SOURCE_LABELS: Record<SourceName, string> = {
  esri: 'Esri',
};

interface TimeTravelDropdownProps {
  defaultYear: string;
  defaultSource: SourceName;
  availableYears: string[];
  availableSources: SourceName[];
  onYearChange: (year: string) => void;
  onSourceChange: (source: SourceName) => void;
  customClassName?: string;
}

const TimeTravelDropdown = ({
  defaultYear,
  defaultSource,
  availableYears,
  availableSources,
  onYearChange,
  onSourceChange,
  customClassName,
}: TimeTravelDropdownProps) => {
  const tTimeTravel = useTranslations('ProjectDetails.timeTravel');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [selectedSource, setSelectedSource] = useState(defaultSource);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

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
    <div
      ref={dropdownRef}
      className={clsx(styles.menuContainer, customClassName)}
    >
      <button
        className={styles.menuButton}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-expanded={isMenuOpen}
        aria-label={tTimeTravel('timeTravelOptionsLabel')}
      >
        <div className={styles.menuButtonTitle}>
          <CalendarIcon
            width={14}
            color={themeProperties.designSystem.colors.coreText}
          />
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
            {availableYears?.map((year) => {
              const isSelected = isOptionSelected(year, selectedYear);
              return (
                <time
                  key={year}
                  dateTime={`${year}`}
                  role="button"
                  aria-selected={isSelected}
                  onClick={() => handleChangeYear(year)}
                  className={clsx({
                    [styles.selectedMenuItem]: isSelected,
                    [styles.unselectedMenuItem]: !isSelected,
                  })}
                >
                  {year}
                </time>
              );
            })}
          </ul>

          <ul className={styles.sourceMenuContainer}>
            {availableSources?.map((source) => {
              const isSelected = isOptionSelected(source, selectedSource);
              return (
                <li
                  key={source}
                  onClick={() => handleChangeSource(source)}
                  className={clsx({
                    [styles.selectedMenuItem]: isSelected,
                    [styles.unselectedMenuItem]: !isSelected,
                  })}
                >
                  {SOURCE_LABELS[source]}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TimeTravelDropdown;
