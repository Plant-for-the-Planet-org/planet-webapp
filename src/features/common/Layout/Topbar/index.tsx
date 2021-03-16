import React, { ReactElement } from 'react'
import Close from '../../../../../public/assets/images/icons/headerIcons/close'

interface Props {
    
}

function Topbar({}: Props): ReactElement {
    const [showTopBar, setshowTopBar] = React.useState(true)
    return (
        <div className={'topbarContainer'} style={{display:showTopBar ? 'flex' : 'none'}}>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. */}
            </p>
            <button onClick={()=>setshowTopBar(false)}>
                <Close color={'#fff'}/>
            </button>
        </div>
    )
}

export default Topbar
