import React, { ReactElement } from 'react'
import Close from '../../../../../public/assets/images/icons/headerIcons/close'
import i18next from './../../../../../i18n'
const { useTranslation } = i18next;

interface Props {
    
}

function Topbar({}: Props): ReactElement {
    const [showTopBar, setshowTopBar] = React.useState(true);
    const { t, ready } = useTranslation(['common']);

    return (
        <div className={'topbarContainer'} style={{display:showTopBar ? 'flex' : 'none'}}>
            <p>
                {t('common:tobBarText')}
                <a href="https://waldrekord.plant-for-the-planet.org/" target="_blank">
                {t('common:clickHere')}
                </a>
            </p>
            <button onClick={()=>setshowTopBar(false)}>
                <Close color={'#fff'}/>
            </button>
        </div>
    )
}

export default Topbar
