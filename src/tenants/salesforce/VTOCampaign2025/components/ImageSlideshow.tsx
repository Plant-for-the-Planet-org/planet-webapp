import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import styles from '../styles/ImageSlideshow.module.scss';

interface SlideImage {
  position: number;
  name: string;
  path: string;
}

const VTO_IMAGES: SlideImage[] = [
  {
    position: 1,
    name: 'VTO Fitness Challenge event photo 1',
    path: '/tenants/salesforce/images/vto/IMG_3889.jpg',
  },
  {
    position: 2,
    name: 'VTO Fitness Challenge event photo 2',
    path: '/tenants/salesforce/images/vto/IMG_8575.jpg',
  },
  {
    position: 3,
    name: 'VTO Fitness Challenge event photo 3',
    path: '/tenants/salesforce/images/vto/IMG_8593.jpg',
  },
  {
    position: 4,
    name: 'VTO Fitness Challenge event photo 4',
    path: '/tenants/salesforce/images/vto/PXL_20260406_191430996.jpg',
  },
  {
    position: 5,
    name: 'VTO Fitness Challenge event photo 5',
    path: '/tenants/salesforce/images/vto/IMG_3272.jpg',
  },
];

// Set to false to disable autoplay and show pagination only. e.g. for debugging
const AUTOPLAY_ENABLED = true;

const sortedImages = [...VTO_IMAGES].sort((a, b) => a.position - b.position);

export default function ImageSlideshow() {
  return (
    <section className={styles.imageSlideshowSection}>
      <h2 className={styles.slideshowTitle}>Our Community in Action</h2>
      <div className={styles.swiperWrapper}>
        <Swiper
          modules={[Autoplay, Pagination]}
          loop={true}
          autoplay={
            AUTOPLAY_ENABLED
              ? {
                  delay: 4500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
              : false
          }
          pagination={{ clickable: true }}
          spaceBetween={0}
          slidesPerView={1}
        >
          {sortedImages.map((image) => (
            <SwiperSlide key={image.position}>
              <div className={styles.slideImageContainer}>
                <img
                  src={image.path}
                  alt={image.name}
                  className={styles.slideImage}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
