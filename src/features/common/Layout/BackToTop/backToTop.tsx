import React,{ useState, useEffect} from 'react';
import { useWindowScroll } from 'react-use';
import Arrow from '../../../../../public/assets/images/icons/DownArrow'
import styles from './BackToTop.module.scss'

const BackToTop = () => {
    const { y: pageYOffset} = useWindowScroll();
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if(pageYOffset > 400){
            setVisible(true)
        } else{
            setVisible(false)
        }
    }, [pageYOffset]);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth"})

    if(!visible) {
        return false;
    }
    return(
        <div onClick={scrollToTop} className={styles.scroll}>
            <Arrow />
        </div>
    )
}

export default BackToTop;