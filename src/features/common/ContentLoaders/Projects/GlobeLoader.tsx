import type { ReactElement } from 'react';

import { motion } from 'framer-motion';

import GlobeLoader from '../../../../../public/assets/images/icons/Globe';

function GlobeContentLoader(): ReactElement {
  return (
    <motion.div
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
  );
}

export default GlobeContentLoader;
