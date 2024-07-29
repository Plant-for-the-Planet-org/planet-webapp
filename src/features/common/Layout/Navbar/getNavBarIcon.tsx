import React, { ReactElement } from 'react';
import Globe from '../../../../../public/assets/images/navigation/Globe';
import GlobeSelected from '../../../../../public/assets/images/navigation/GlobeSelected';
import Leaderboard from '../../../../../public/assets/images/navigation/Leaderboard';
import LeaderboardSelected from '../../../../../public/assets/images/navigation/LeaderboardSelected';
import LeafSelected from '../../../../../public/assets/images/navigation/LeafSelected';
import Leaf from '../../../../../public/assets/images/navigation/Leaf';
import themeProperties from '../../../../theme/themeProperties';
import ShopIcon from '../../../../../public/assets/images/navigation/ShopIcon';
import HomeLogoSelected from '../../../../../public/assets/images/navigation/HomeLogoSelected';
import HomeLogo from '../../../../../public/assets/images/navigation/HomoLogo';
import DonateSelected from '../../../../../public/assets/images/navigation/DonateSelected';
import Donate from '../../../../../public/assets/images/navigation/Donate';
import { NextRouter } from 'next/router';

interface Props {
  mainKey: string;
  router: NextRouter;
  item: {
    title: string;
    loggedInTitle?: string;
    onclick: string;
    visible: boolean;
    subMenu?: {
      title: string;
      onclick: string;
      visible: boolean;
    }[];
  };
  tenantName: string;
}

function GetNavBarIcon({
  mainKey,
  router,
  item,
  tenantName,
}: Props): ReactElement {
  const HomeLink = () => {
    return (
      <button
        id="homeIcon"
        className={`link_icon ${
          router.pathname === item.onclick ? 'active_icon' : ''
        }`}
      >
        {router.pathname === item.onclick ? (
          tenantName === 'salesforce' ? (
            //the homelogo for all tenant remains the same except salesforce tenant
            <GlobeSelected color={themeProperties.primaryColor} />
          ) : (
            <HomeLogoSelected color={themeProperties.primaryColor} />
          )
        ) : tenantName === 'salesforce' ? (
          <Globe color={themeProperties.light.primaryFontColor} />
        ) : (
          <HomeLogo color={themeProperties.light.primaryFontColor} />
        )}
      </button>
    );
  };
  const DonateLink = () => {
    return (
      <button
        id="donateIcon"
        className={`link_icon ${
          router.pathname === item.onclick || router.pathname === '/[p]'
            ? 'active_icon'
            : ''
        }`}
      >
        {router.pathname === item.onclick || router.pathname === '/[p]' ? (
          <DonateSelected color={themeProperties.primaryColor} />
        ) : (
          <Donate color={themeProperties.light.primaryFontColor} />
        )}
      </button>
    );
  };
  const AboutUsLink = () => {
    return (
      <button
        id="aboutIcon"
        className={`link_icon ${
          router.pathname === item.onclick ? 'active_icon' : ''
        }`}
      >
        {router.pathname === item.onclick ? (
          <LeafSelected color={themeProperties.primaryColor} />
        ) : (
          <Leaf color={themeProperties.light.primaryFontColor} />
        )}
      </button>
    );
  };
  const LeadersLink = () => {
    return (
      <button
        id="leaderIcon"
        className={`link_icon ${
          router.pathname === item.onclick ? 'active_icon' : ''
        }`}
      >
        {router.pathname === item.onclick ? (
          <LeaderboardSelected color={themeProperties.primaryColor} />
        ) : (
          <Leaderboard color={themeProperties.light.primaryFontColor} />
        )}
      </button>
    );
  };
  const ShopLink = () => {
    return (
      <button
        id="shopIcon"
        className={`link_icon ${
          router.pathname === item.onclick ? 'active_icon' : ''
        }`}
      >
        {router.pathname === item.onclick ? (
          <ShopIcon color={themeProperties.primaryColor} />
        ) : (
          <ShopIcon color={themeProperties.light.primaryFontColor} />
        )}
      </button>
    );
  };
  switch (mainKey) {
    case 'home':
      return <HomeLink />;
    case 'donate':
      return <DonateLink />;
    case 'about':
      return <AboutUsLink />;
    case 'leaderboard':
      return <LeadersLink />;
    case 'shop':
      return <ShopLink />;
    default:
      return <></>;
  }
}

export default GetNavBarIcon;
