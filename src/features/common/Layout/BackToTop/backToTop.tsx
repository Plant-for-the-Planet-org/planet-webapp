import React,{ useState, useEffect} from 'react';
import Arrow from '../../../../../public/assets/images/icons/DownArrow'
import styles from './BackToTop.module.scss'

const BackToTop = (showBelow) => {
    const [show, setShow] = useState(showBelow ? false : true);
    const handleScroll = () => {
        if(window.pageYOffset > showBelow){
            if(!show) 
            setShow(true)
        }else {
            if(show) 
            setShow(false)
        }
    }

    useEffect(() => {
        if(showBelow){
            window.addEventListener(`scroll`, handleScroll)
            return () => window.removeEventListener(`scroll`, handleScroll)
        }
    })
    
    const handleClick = () => {
        window[`scrollTo`]({ top: 0, behavior: `smooth`})
    }

    return(
        <button onClick={handleClick} className={styles.scroll}>
            <Arrow />
        </button>
    )
}

export default BackToTop;