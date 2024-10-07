import styles from './MobileInfoSwiper.module.scss';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/scss';
import 'swiper/scss/pagination';
import TreeMapperBrand from '../ProjectDetails/components/microComponents/TreeMapperBrand';

function MobileInfoSwiper() {
  return (
    <div className={styles.mobileInfoSwiper}>
      <div className={styles.swiperContentContainer}>
        <Swiper
          pagination={true}
          modules={[Pagination]}
          className={styles.swiper}
        >
          <SwiperSlide>Slide 1</SwiperSlide>
          <SwiperSlide>Slide 2</SwiperSlide>
          <SwiperSlide>Slide 3</SwiperSlide>
          <SwiperSlide>Slide 4</SwiperSlide>
          <div className={styles.logoContainer}>
            <TreeMapperBrand />
          </div>
        </Swiper>
      </div>
    </div>
  );
}
export default MobileInfoSwiper;
