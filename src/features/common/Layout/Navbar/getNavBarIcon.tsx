import React, {ReactElement} from 'react'
import Donate from '../../../../../public/assets/images/navigation/Donate';
import DonateSelected from '../../../../../public/assets/images/navigation/DonateSelected';
import Globe from '../../../../../public/assets/images/navigation/Globe';
import GlobeSelected from '../../../../../public/assets/images/navigation/GlobeSelected';
import Leaderboard from '../../../../../public/assets/images/navigation/Leaderboard';
import LeaderboardSelected from '../../../../../public/assets/images/navigation/LeaderboardSelected';
import LeafSelected from '../../../../../public/assets/images/navigation/LeafSelected';
import Leaf from '../../../../../public/assets/images/navigation/Leaf';
import themeProperties from '../../../../theme/themeProperties';

interface Props {
    mainKey:any;
    router:any;
    item:any;
}

function GetNavBarIcon({mainKey,router,item}: Props):ReactElement {

    const HomeLink =()=>{
        return(
            <div className={'link_icon'}>
                {router.pathname === item.onclick ? (
                    <GlobeSelected color={themeProperties.primaryColor} />
                ) : (
                        <Globe color={themeProperties.light.primaryFontColor} />
                    )}
            </div>
        )
    }
    const DonateLink =()=>{
        return(
            <div className={'link_icon'}>
                {router.pathname === item.onclick ? (
                    <DonateSelected color={themeProperties.primaryColor} />
                ) : (
                        <Donate color={themeProperties.light.primaryFontColor} />
                    )}
            </div>
        )
    }
    const AboutUsLink =()=>{
        return(
            <div className={'link_icon'}>
                {router.pathname === item.onclick ? (
                    <LeafSelected color={themeProperties.primaryColor} />
                ) : (
                        <Leaf color={themeProperties.light.primaryFontColor} />
                    )}
            </div>
        )
    }
    const LeadersLink =()=>{
        return(
            <div className={'link_icon'}>
                {router.pathname === item.onclick ? (
                    <LeaderboardSelected color={themeProperties.primaryColor} />
                ) : (
                        <Leaderboard color={themeProperties.light.primaryFontColor} />
                    )}
            </div>
        )
    }
    switch(mainKey){
        case 'home': return <HomeLink/>;
        case 'donate': return <DonateLink/>;
        case 'about': return <AboutUsLink/>;
        case 'leaderboard': return <LeadersLink/>;
        default: <></>;
    }
}

export default GetNavBarIcon
