import React, {ReactElement} from 'react';
import ChildrenYouthIcon from '../../../../../public/assets/images/icons/megaMenuIcons/childrenAndyouth';
import OverviewIcon from '../../../../../public/assets/images/icons/megaMenuIcons/overview';
import PartnerIcon from '../../../../../public/assets/images/icons/megaMenuIcons/partners';
import TrillionTreesIcon from '../../../../../public/assets/images/icons/megaMenuIcons/trillionTrees';
import YucatanIcon from '../../../../../public/assets/images/icons/megaMenuIcons/yucatan';
import ChangeChocolateIcon from '../../../../../public/assets/images/icons/megaMenuIcons/changeChocolate';
import StopTalkingStartPlantingIcon from '../../../../../public/assets/images/icons/megaMenuIcons/stoptalkingstartplanting';


interface Props {
    title: any
}

function GetSubMenu({title}: Props): ReactElement{
    const Overview = () => {
        return <OverviewIcon />
    }

    const Partners = () => {
        return <PartnerIcon />
    }

    const TrillionTrees = () => {
        return <TrillionTreesIcon />
    }

    const Yucatan = () => {
        return <YucatanIcon />
    }

    const ChangeChocolate = () => {
        return <ChangeChocolateIcon />
    }

    const ChildrenYouth = () => {
        return <ChildrenYouthIcon />
    }

    const StopTalkingStartPlanting = () => {
        return <StopTalkingStartPlantingIcon />
    }

    switch (title){
        case 'Overview' : return <Overview/>
        case 'Children and Youth' : return <ChildrenYouth/>
        case 'Trillion Trees' : return <TrillionTrees/>
        case 'Yucatan' : return <Yucatan/>
        case 'Partners' : return <Partners/>
        case 'Change Chocolate' : return <ChangeChocolate/>
        case 'Stop Talking Start Planting' : return <StopTalkingStartPlanting/>
    }
}


export default GetSubMenu;