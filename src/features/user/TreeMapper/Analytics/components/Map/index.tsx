import { Container } from '../Container';
import styles from './index.module.scss';

export const Map = () => {
  return (
    <Container leftElement={<p className={styles.title}>Hello</p>}>
      <p>Map</p>
    </Container>
  );
};
