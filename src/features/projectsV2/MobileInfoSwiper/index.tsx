import type { ReactNode } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/scss';
import 'swiper/scss/pagination';

import TreeMapperBrand from '../ProjectDetails/components/microComponents/TreeMapperBrand';
import styles from './MobileInfoSwiper.module.scss';

type MobileInfoSwiperProps = {
  slides: ReactNode[];
  uniqueKey: string;
};

function MobileInfoSwiper({ slides, uniqueKey }: MobileInfoSwiperProps) {
  return (
    <div className={styles.mobileInfoSwiper}>
      <div className={styles.swiperContentContainer}>
        <Swiper
          key={uniqueKey}
          pagination={true}
          modules={[Pagination]}
          autoHeight={true}
          observer={true}
          observeParents={true}
          spaceBetween={40}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className={styles.slideContainer}>{slide}</div>
            </SwiperSlide>
          ))}
          <div className={styles.logoContainer}>
            <TreeMapperBrand />
          </div>
        </Swiper>
      </div>
    </div>
  );
}
export default MobileInfoSwiper;
