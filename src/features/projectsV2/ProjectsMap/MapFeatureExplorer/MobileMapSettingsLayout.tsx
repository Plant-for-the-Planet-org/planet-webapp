import type { SetState } from '../../../common/types/common';
import type { ReactNode } from 'react';

import { useTranslations } from 'next-intl';
import { useState, useEffect, useRef } from 'react';
import { ExploreIcon } from '../../../../../public/assets/images/icons/projectV2/ExploreIcon';
import CrossIcon from '../../../../../public/assets/images/icons/projectV2/CrossIcon';
import styles from './MobileMapSettingsLayout.module.scss';
import { clsx } from 'clsx';

interface Props {
  setIsOpen: SetState<boolean>;
  children: ReactNode;
}

const MobileMapSettingsLayout = ({ setIsOpen, children }: Props) => {
  const tMaps = useTranslations('Maps');
  const [isAtBottom, setIsAtBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;

    const { scrollHeight, scrollTop, clientHeight } = scrollRef.current;
    // Add a small buffer (10px) to trigger the border radius transition a little before the bottom
    const isBottom = Math.abs(scrollHeight - scrollTop - clientHeight) <= 10;
    setIsAtBottom(isBottom);
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      // Check initial scroll position
      handleScroll();
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.exploreLabel}>
          <ExploreIcon />
          <p>{tMaps('explore')}</p>
        </div>
        <button
          className={styles.closeButton}
          onClick={() => setIsOpen(false)}
          aria-label={tMaps('exploreLayers.closeButton')}
          type="button"
        >
          <CrossIcon />
        </button>
      </div>
      <div
        ref={scrollRef}
        className={clsx(
          styles.scrollableContent,
          isAtBottom && styles.atBottom
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default MobileMapSettingsLayout;
