import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Col, Row } from 'react-bootstrap';
import MaterialTextFeild from '../../../../features/common/InputTypes/MaterialTextFeild';
import styles from './../About.module.scss';

export default function Blogs() {
  const blogs = [
    {
      id: 1,
      location: 'Mexico',
      name: 'Reforestation in Tough Times',
      imagePath: '/static/images/home/Blog1.jpg',
      link: '',
    },
    {
      id: 2,
      location: 'Italy',
      name: 'Climate Justice Ambassador Receives Environmental Award',
      imagePath: '/static/images/home/Blog1.jpg',
      link: '',
    },
    {
      id: 3,
      location: 'Germany',
      name: 'In Memoriam of Wangari Maathai',
      imagePath: '/static/images/home/Blog1.jpg',
      link: '',
    },
  ];
  return (
    <section className={styles.blogSection}>
      <p className={styles.blogSectionHeader}>What’s new?</p>
      <Row className={styles.blogContainer}>
        {blogs.map((blog) => {
          return (
            <Col key={blog.id} sm={10} lg={4}>
              <div className={styles.blogSingelContainer}>
                <img className={styles.blogImage} src={blog.imagePath} />
                <p className={styles.blogLocation}>{blog.location}</p>
                <p className={styles.blogTitle}>{blog.name}</p>
                <p className={styles.blogLink}>Read</p>
              </div>
            </Col>
          );
        })}
      </Row>
      <Row>
        <Col className={styles.subscribeForm} lg={12}>
          <MaterialTextFeild
            label="Email"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="subscribe"
                    // onClick={handleClickShowPassword}
                    // onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    <div
                      style={{
                        backgroundColor: '#87B738',
                        fontFamily: 'Raleway',
                        fontSize: '14px',
                        color: 'white',
                        borderRadius: '9px',
                        textAlign: 'center',
                        padding: '9px 30px',
                      }}
                    >
                      Subscribe
                    </div>
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <p className={styles.subscribePara}>
            You’ll hear from us once or twice a month.
          </p>
        </Col>
      </Row>
    </section>
  );
}
