import React, { ReactElement } from 'react';
import ChildrenYouthIcon from '../../../../../public/assets/images/icons/megaMenuIcons/childrenAndYouth';
import OverviewIcon from '../../../../../public/assets/images/icons/megaMenuIcons/overview';
import PartnerIcon from '../../../../../public/assets/images/icons/megaMenuIcons/partners';
import TrillionTreesIcon from '../../../../../public/assets/images/icons/megaMenuIcons/trillionTrees';
import YucatanIcon from '../../../../../public/assets/images/icons/megaMenuIcons/yucatan';
import ChangeChocolateIcon from '../../../../../public/assets/images/icons/megaMenuIcons/changeChocolate';
import StopTalkingStartPlantingIcon from '../../../../../public/assets/images/icons/megaMenuIcons/stoptalkingstartplanting';
import { Link } from '@material-ui/core';


interface Props {
    title: any
    onclick: any
}

function GetSubMenu({ title, onclick }: Props): ReactElement {
    const Overview = () => {
        return (
            <Link id="overviewButton" className={'link_icon'} href={onclick}>
                <OverviewIcon />
            </Link>

        )
    }

    const Partners = () => {
        return (
            <Link id="overviewButton" className={'link_icon'} href={onclick}>
                <PartnerIcon />
            </Link>
        )
    }

    const TrillionTrees = () => {
        return (
            <button id="overviewButton" className={'link_icon'} >
                <TrillionTreesIcon />
            </button>
        )
    }

    const Yucatan = () => {
        return (
            <button id="overviewButton" className={'link_icon'} >
                <YucatanIcon />
            </button>
        )
    }

    const ChangeChocolate = () => {
        return (
            <button id="overviewButton" className={'link_icon'} >
                <ChangeChocolateIcon />
            </button>
        )
    }

    const ChildrenYouth = () => {
        return (
            <button id="overviewButton" className={'link_icon'} >
                <ChildrenYouthIcon />
            </button>
        )
    }

    const StopTalkingStartPlanting = () => {
        return (
            <button id="overviewButton" className={'link_icon'} >
                <StopTalkingStartPlantingIcon />
            </button>
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