import styles from './../About.module.scss';
export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: 'National Geographic',
      imagePath: '/static/images/home/NatGeo.jpg',
      link: '',
    },
    {
      id: 2,
      name: 'The Washington Post',
      imagePath: '/static/images/home/Washington.jpg',
      link: '',
    },
    {
      id: 3,
      name: 'Süddeutsche_Zeitung',
      imagePath: '/static/images/home/Suddeutsche.jpg',
      link: '',
    },
    {
      id: 4,
      name: 'The Guardian',
      imagePath: '/static/images/home/TheGuardian.jpg',
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
