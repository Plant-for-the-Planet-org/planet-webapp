import styles from './Footer.module.css'
import Link from 'next/link'
import World from './../../../assets/images/footer/World'
import GooglePlay from './../../../assets/images/footer/GooglePlay'
import AppStore from './../../../assets/images/footer/AppStore'
import UNEPLogo from './../../../assets/images/footer/UNEPLogo'
import PlanetLogo from './../../../assets/images/PlanetLogo'

export default function Footer() {
    return (
        <footer>
            <div className="container">
                <div className={[styles.hr]}/>
            

                <div className={styles.footer_container}>
                    <div>
                        <div className={styles.footer_button_container}>
                            <div className={styles.footer_button}>
                                <World/>
                                <p className={styles.selected_language}>English (USD)</p>
                            </div>
                            <div className={styles.footer_button}>
                                <GooglePlay/>
                                <p className={styles.selected_language_bold}>Google Play</p>
                            </div>
                            <div className={styles.footer_button}>
                                <AppStore/>
                                <p className={styles.selected_language_bold}>App Store</p>
                            </div>
                        </div>
                        <div className={styles.footer_links_container}>
                            <p className={styles.footer_links}>© 2020 Plant-for-the-Planet</p>
                            <Link href="/">
                                <p className={styles.footer_links}>Privacy & Terms</p>
                            </Link>
                            <Link href="/">
                                <p className={styles.footer_links}>Imprint</p>
                            </Link>
                            <Link href="/">
                                <p className={styles.footer_links}>Contact</p>
                            </Link>
                            <Link href="/">
                                <p className={styles.footer_links}>FAQs</p>
                            </Link>
                        </div>
                    </div>
                    <div className={styles.logo_container}>
                        <div className={styles.pfp_logo}>
                            <PlanetLogo/>
                        </div>
                        <div className={styles.unep_logo_container}>
                            <div>
                                <p className={styles.unep_logo_text}>Supports the UNEP</p>
                                <UNEPLogo/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
