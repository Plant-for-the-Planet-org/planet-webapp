import React, { ReactElement } from 'react'
import Close from '../../../../../public/assets/images/icons/headerIcons/close'
import i18next from './../../../../../i18n'
const { useTranslation } = i18next;

interface Props {

}

function Topbar({ }: Props): ReactElement {
    const [showTopBar, setshowTopBar] = React.useState(true);
    const { t, ready, i18n } = useTranslation(['common']);
    const [data, setData] = React.useState();

    React.useEffect(() => {
        async function loadData() {
            try {
                const res = await fetch(`${process.env.TOPBAR_API_URL}/topbar/${process.env.TENANTID}/messages.json`);
                console.log('topbar',res);
                setData(res.status === 200 ? await res.json() : null);
            }
            catch(e:any) {
                console.log("Error: ",e);
            }
            
        }
        loadData();
    }, []);

    return data ? (

        <div className={'topbarContainer'} style={{ display: showTopBar ? 'flex' : 'none' }}>
            <p>
                {data.[i18n.language].text}
                <a href={`${data.[i18n.language].ctaLink}`} target="_blank">
                {data.[i18n.language].ctaText}
                </a>
            </p>
            <button onClick={() => setshowTopBar(false)}>
                <Close color={'#fff'} />
            </button>
        </div>
    ) : <></>
}

export default Topbar
