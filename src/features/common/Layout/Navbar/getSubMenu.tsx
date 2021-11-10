import React, { ReactElement } from 'react';
import ChildrenYouthIcon from '../../../../../public/assets/images/icons/megaMenuIcons/childrenAndYouth';
import OverviewIcon from '../../../../../public/assets/images/icons/megaMenuIcons/overview';
import PartnerIcon from '../../../../../public/assets/images/icons/megaMenuIcons/partners';
import TrillionTreesIcon from '../../../../../public/assets/images/icons/megaMenuIcons/trillionTrees';
import YucatanIcon from '../../../../../public/assets/images/icons/megaMenuIcons/yucatan';
import ChangeChocolateIcon from '../../../../../public/assets/images/icons/megaMenuIcons/changeChocolate';
import StopTalkingStartPlantingIcon from '../../../../../public/assets/images/icons/megaMenuIcons/stoptalkingstartplanting';

interface Props {
    title: any
}

function GetSubMenu({ title }: Props): ReactElement {
    const Overview = () => {
        return (
            <div id="overviewButton" className={'link_icon'}>
                <OverviewIcon />
            </div>
        )
    }

    const Partners = () => {
        return (
            <div id="overviewButton" className={'link_icon'}>
                <PartnerIcon />
            </div>
        )
    }

    const TrillionTrees = () => {
        return (
            <div id="overviewButton" className={'link_icon'} >
                <TrillionTreesIcon />
            </div>
        )
    }

    const Yucatan = () => {
        return (
            <div id="overviewButton" className={'link_icon'} >
                <YucatanIcon />
            </div>
        )
    }

    const ChangeChocolate = () => {
        return (
            <div id="overviewButton" className={'link_icon'} >
                <ChangeChocolateIcon />
            </div>
        )
    }

    const ChildrenYouth = () => {
        return (
            <div id="overviewButton" className={'link_icon'} >
                <ChildrenYouthIcon />
            </div>
        )
    }

    const StopTalkingStartPlanting = () => {
        return (
            <div id="overviewButton" className={'link_icon'} >
                <StopTalkingStartPlantingIcon />
            </div>
        )
    }

    switch (title) {
        case 'Overview': return <Overview />
        case 'Children and Youth': return <ChildrenYouth />
        case 'Trillion Trees': return <TrillionTrees  />
        case 'Yucatan': return <Yucatan />
        case 'Partners': return <Partners />
        case 'Change Chocolate': return <ChangeChocolate />
        case 'Stop Talking Start Planting': return <StopTalkingStartPlanting />
    }
}


export default GetSubMenu;