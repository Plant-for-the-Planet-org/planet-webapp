import styles from './MobileInfoSwiper.module.scss';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/scss';
import 'swiper/scss/pagination';
import TreeMapperBrand from '../ProjectDetails/components/microComponents/TreeMapperBrand';
import { ReactNode } from 'react';

type MobileInfoSwiperProps = {
  slides: ReactNode[];
};

function MobileInfoSwiper({ slides }: MobileInfoSwiperProps) {
  return (
    <div className={styles.mobileInfoSwiper}>
      <div className={styles.swiperContentContainer}>
        <Swiper
          pagination={true}
          modules={[Pagination]}
          autoHeight={true}
          observer={true}
          observeParents={true}
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
