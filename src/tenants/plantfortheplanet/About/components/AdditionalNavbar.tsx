import styles from './../About.module.scss';

export default function AdditionalNavbar() {
  const additionalNavbar = [
    { id: 1, name: 'Children & Youth', path: '' },
    { id: 2, name: 'About  Us', path: '' },
    { id: 3, name: 'Membership', path: '' },
    { id: 4, name: 'Support', path: '', highlight: true },
  ];

  return (
    <div className={styles.topbarContainer}>
      {additionalNavbar.map((item) => {
        return (
          <a
            href="#"
            key={item.id}
            className={
              item.highlight ? styles.navlinkHighlight : styles.navlink
            }
          >
            <p>{item.name}</p>
          </a>
        );
      })}
    </div>
  );
}
