import Image from 'react-bootstrap/Image'
import styles from './Home.module.scss'
import LazyLoad from 'react-lazyload';
import Youtube from './../../../assets/images/home/Youtube'
import { Container,Row,Col } from 'react-bootstrap';

import MaterialTextFeild from './../../common/InputTypes/MaterialTextFeild'
import MaterialTextFeildButton from './../../common/InputTypes/MaterialTextFieldButton'
export default function Home() {
  const additionalNavbar = [
    {id:1,name:'Children & Youth',path:''},
    {id:2,name:'About  Us',path:''},
    {id:3,name:'Membership',path:''},
    {id:4,name:'Support',path:'',highlight:true},
  ]

  const testimonials = [
    {id:1,name:'National Geographic',imagePath:'/static/images/home/NatGeo.jpg',link:''},
    {id:2,name:'The Washington Post',imagePath:'/static/images/home/Washington.jpg',link:''},
    {id:3,name:'Süddeutsche_Zeitung',imagePath:'/static/images/home/Suddeutsche.jpg',link:''},
    {id:4,name:'The Guardian',imagePath:'/static/images/home/TheGuardian.jpg',link:''},
  ]

  const blogs = [
    {id:1,location:'Mexico',name:'Reforestation in Tough Times',imagePath:'/static/images/home/Blog1.jpg',link:''},
    {id:2,location:'Italy',name:'Climate Justice Ambassador Receives Environmental Award',imagePath:'/static/images/home/Blog1.jpg',link:''},
    {id:3,location:'Germany',name:'In Memoriam of Wangari Maathai',imagePath:'/static/images/home/Blog1.jpg',link:''},
  ]
    return (
      <main>
        <div className={styles.topbarContainer}>
          {
            additionalNavbar.map(item=>{
              return(
                <a href='#' key={item.id} className={item.highlight?styles.navlinkHighlight:styles.navlink}>
                  <p>{item.name}</p>
                </a>
              )
            })
          }
        </div>
        
       <section className={styles.landingSection}>
         <div className={styles.backgroundImage}>
            <LazyLoad>
              <Image fluid src={'/static/images/home/BGHome.jpg'} />
            </LazyLoad>
         </div>
       
          <div className={styles.landingContent}>
            <Youtube/>
            <p>
            We children and youth to stand up for
            their future by planting trees &
            mobilizing the world to plant a trillion!
            </p>

          </div>
       </section>

       <Container fluid="md">
        <Row className={styles.aboutSection}>
          <Col xs={12} md={6} className={styles.aboutSectionImages}>
          <img style={{width:'100%'}} src={'/static/images/home/About1.jpg'} />
            <img style={{width:'48%',marginTop:'16px'}} src={'/static/images/home/About2.jpg'} />
            <img style={{width:'48%',marginTop:'16px'}} src={'/static/images/home/About3.jpg'} />
            
          </Col>
          <Col xs={12} md={6} className={styles.aboutSectionText}>
          <p className={styles.aboutSectionTextHeader}>We Make Ourselves Heard </p>
            <p className={styles.aboutSectionTextPara}>Over 80 thousand 10–14 year olds have joined 
                us to learn about the climate crisis, give 
                speeches to mobilize adults and plant trees
            </p>
            <p className={styles.aboutSectionTextLink}>Join Us</p>
          </Col>
        </Row>
      </Container>

      <section className={styles.YucantanSection}>
        <Image fluid src={'/static/images/home/Yucantan.jpg'} />
        <div className={styles.YucantanSectionText}>
              <p className={styles.YucantanSectionTextHeader}>Yucatan Reforestation</p>
              <p className={styles.YucantanSectionTextPara}>100 people planting 2 million trees 
              a year to bring back a beautiful rainforest</p>
              <div className={styles.YucantanSectionTextLinkContainer}>
                <p className={styles.YucantanSectionTextLink}>Learn More</p>
                <p className={styles.YucantanSectionTextLink}>Donate</p>
              </div>
        </div>
      </section>


      <Container fluid="md">
        <Row className={styles.changeChocolateSection}>
          <Col xs={12} md={8} className={styles.changeChocolateSectionText}>
            <p className={styles.changeChocolateSectionTextHeader}>The Change Chocolate</p>
            <p className={styles.changeChocolateSectionTextPara}>The chocolate that plants trees.</p>
            <p className={styles.changeChocolateSectionTextPara}>21M bars sold • 5M trees planted</p>
            <div className={styles.changeChocolateSectionTextLinkContainer}>
              <p className={styles.changeChocolateSectionTextLink}>Learn More</p>
              <p className={styles.changeChocolateSectionTextLink}>Chocolate Code</p>
              <p className={styles.changeChocolateSectionTextLink}>Order</p>
            </div>
            <img style={{width:'100%'}} src={'/static/images/home/Chocolate.jpg'} />
            
          </Col>
        </Row>
      </Container>


      <section className={styles.YucantanSection}>
        <Image fluid src={'/static/images/home/WhyTrees.jpg'} />
        <div className={styles.YucantanSectionText}>
              <p className={styles.YucantanSectionTextHeader}>Why Trees?</p>
              <p className={styles.YucantanSectionTextPara}>How many are there? How many can we plant? Trees are one of the most powerful tools in a fight against the climate crisis.</p>
              <div className={styles.YucantanSectionTextLinkContainer}>
                <p className={styles.YucantanSectionTextLink}>Learn More</p>
              </div>
        </div>
      </section>


      <section className={styles.YucantanSection}>
        <Image fluid src={'/static/images/home/ClimageNeutrality.jpg'} />
        <div className={styles.YucantanSectionText}>
              <p className={styles.YucantanSectionTextHeader}>Double Climate Neutrality</p>
              <p className={styles.YucantanSectionTextPara}>We work with you on your climate journey with Carbon Credits</p>
              <div className={styles.YucantanSectionTextLinkContainer}>
                <p className={styles.YucantanSectionTextLink}>Learn More</p>
              </div>
        </div>
      </section>

      <section className={styles.testimonialSection}> 
        <p className={styles.testimonialSectionHeader}>What others say about us</p>
        <div className={styles.testimonialSectionImagesContainer}>
          {
            testimonials.map(testimonial => {
              return(
                <img key={testimonial.id} alt={testimonial.name} src={testimonial.imagePath} />
              )
            })
          }
          
        </div>
      </section>

      <section className={styles.blogSection}>
        <p className={styles.blogSectionHeader}>What’s new?</p>
        <Row className={styles.blogContainer}>
        {blogs.map(blog=>{
          return(
            <Col key={blog.id} sm={10} lg={4}>
            <div className={styles.blogSingelContainer}>
              <img className={styles.blogImage} src={blog.imagePath} />
              <p className={styles.blogLocation}>{blog.location}</p>
              <p className={styles.blogTitle}>{blog.name}</p>
              <p className={styles.blogLink}>Read</p>            
            </div>
          </Col>
          )
        })}
          
        </Row>
        <Row>
          <Col className={styles.subscribeForm} lg={12}>
          <MaterialTextFeildButton
                label="Email"
                variant="outlined"
            />
            <p className={styles.subscribePara}>You’ll hear from us once or twice a month.</p>
          </Col>
        </Row>

      </section>
      </main>
    )
}
