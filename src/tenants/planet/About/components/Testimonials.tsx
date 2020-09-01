import styles from './../About.module.scss';
export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: 'National Geographic',
      imagePath: '/tenants/planet/images/home/NatGeo.jpg',
      link: '',
    },
    {
      id: 2,
      name: 'The Washington Post',
      imagePath: '/tenants/planet/images/home/Washington.jpg',
      link: '',
    },
    {
      id: 3,
      name: 'Süddeutsche_Zeitung',
      imagePath: '/tenants/planet/images/home/Suddeutsche.jpg',
      link: '',
    },
    {
      id: 4,
      name: 'The Guardian',
      imagePath: '/tenants/planet/images/home/TheGuardian.jpg',
      link: '',
    },
  ];
  return (
    <section className={styles.testimonialSection}>
      <p className={styles.testimonialSectionHeader}>
        What others say about us
      </p>
      <div className={styles.testimonialSectionImagesContainer}>
        {testimonials.map((testimonial) => {
          return (
            <img
              key={testimonial.id}
              alt={testimonial.name}
              src={testimonial.imagePath}
            />
          );
        })}
      </div>
    </section>
  );
}
