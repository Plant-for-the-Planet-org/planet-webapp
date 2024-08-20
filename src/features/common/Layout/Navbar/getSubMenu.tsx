import React, { ReactElement } from 'react';
import ChildrenYouthIcon from '../../../../../public/assets/images/icons/megaMenuIcons/childrenAndYouth';
import OverviewIcon from '../../../../../public/assets/images/icons/megaMenuIcons/overview';
import PartnerIcon from '../../../../../public/assets/images/icons/megaMenuIcons/partners';
import TrillionTreesIcon from '../../../../../public/assets/images/icons/megaMenuIcons/trillionTrees';
import YucatanIcon from '../../../../../public/assets/images/icons/megaMenuIcons/yucatan';
import ChangeChocolateIcon from '../../../../../public/assets/images/icons/megaMenuIcons/changeChocolate';
import StopTalkingStartPlantingIcon from '../../../../../public/assets/images/icons/megaMenuIcons/stoptalkingstartplanting';
import VTOChallengeIcon from '../../../../../public/assets/images/navigation/VTOChallengeIcon';
import OceanforceChallengeIcon from '../../../../../public/assets/images/navigation/OceanforceChallengeIcon';

interface Props {
  title: string;
}

function GetSubMenuIcons({ title }: Props): ReactElement {
  const Overview = () => {
    return (
      <div id="overviewButton" className="link_icon">
        <OverviewIcon />
      </div>
    );
  };

  const Partners = () => {
    return (
      <div id="overviewButton" className="link_icon">
        <PartnerIcon />
      </div>
    );
  };

  const TrillionTrees = () => {
    return (
      <div id="overviewButton" className="link_icon">
        <TrillionTreesIcon />
      </div>
    );
  };

  const Yucatan = () => {
    return (
      <div id="overviewButton" className="link_icon">
        <YucatanIcon />
      </div>
    );
  };

  const ChangeChocolate = () => {
    return (
      <div id="overviewButton" className="link_icon">
        <ChangeChocolateIcon />
      </div>
    );
  };

  const ChildrenYouth = () => {
    return (
      <div id="overviewButton" className="link_icon">
        <ChildrenYouthIcon />
      </div>
    );
  };

  const StopTalkingStartPlanting = () => {
    return (
      <div id="overviewButton" className="link_icon">
        <StopTalkingStartPlantingIcon />
      </div>
    );
  };

  const VTOChallenge = () => {
    return (
      <div id="overviewButton" className="link_icon">
        <VTOChallengeIcon />
      </div>
    );
  };

  const Mangroves = () => {
    return (
      <div id="overviewButton" className="link_icon">
        <OceanforceChallengeIcon />
      </div>
    );
  };

  switch (title) {
    case 'overview':
      return <Overview />;
    case 'childrenAndYouth':
      return <ChildrenYouth />;
    case 'trillionTrees':
      return <TrillionTrees />;
    case 'yucatan':
      return <Yucatan />;
    case 'partners':
      return <Partners />;
    case 'changeChocolate':
      return <ChangeChocolate />;
    case 'stopTalkingStartPlanting':
      return <StopTalkingStartPlanting />;
    case 'vtoChallenge':
      return <VTOChallenge />;
    case 'mangroves':
      return <Mangroves />;
    default:
      return <></>;
  }
}

export default GetSubMenuIcons;
