import type { ReactElement } from 'react';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import GlobeLoader from '../../../../../public/assets/images/icons/Globe';
import LiveRegion from '../../LiveRegion';

function GlobeContentLoader(): ReactElement {
  const t = useTranslations('Common');

  return (
    <motion.div
      aria-busy="true"
      animate={{
        translateY: [0, 20, 0],
      }}
      transition={{
        duration: 1,
        ease: 'easeInOut',
        times: [0, 0.5, 1],
        loop: Infinity,
        repeatDelay: 0,
      }}
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* The animated globe carries no text, so the loading state is
          announced instead. Absolutely positioned, so it stays out of the
          flex flow and the globe keeps its centred position. */}
      <LiveRegion politeness="polite" isVisuallyHidden>
        {t('loading')}
      </LiveRegion>
      <GlobeLoader />
    </motion.div>
  );
}

export default GlobeContentLoader;
