import type { ReactElement } from 'react';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import GlobeLoader from '../../../../../public/assets/images/icons/Globe';
import LiveRegion from '../../LiveRegion';

function GlobeContentLoader(): ReactElement {
  const t = useTranslations('Common');

  return (
    <>
      {/* The animated globe has no text, so the loading message is announced
    instead. The live region is placed next to the globe, not inside it,
    because the globe uses `aria-busy`. Screen readers may ignore live region
    updates inside a busy element until loading finishes.

    The live region cannot stay on the page because this component is only
    rendered while loading. That's okay here because the loading message never
    changes. */}
      <LiveRegion politeness="polite" isVisuallyHidden>
        {t('loading')}
      </LiveRegion>
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
        <GlobeLoader />
      </motion.div>
    </>
  );
}

export default GlobeContentLoader;
