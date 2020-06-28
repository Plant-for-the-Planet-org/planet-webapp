import Image from 'react-bootstrap/Image'
import styles from './Home.module.css'
export default function Home() {
    return (
      <main>
       <div style={{width:'100vw'}}>
        <Image src='/static/images/home/background.jpg' fluid/>
       </div>

       <section className={styles.section}>
         <h2>Leaderboard</h2>
       </section>

       <section className={styles.section}>
         <h2>Stories</h2>
       </section>

       <section className={styles.section}>
         <h2>Timeline</h2>
       </section>

       <section className={styles.section}>
         <h2>Tree Inventory</h2>
       </section>
      </main>
    )
}
