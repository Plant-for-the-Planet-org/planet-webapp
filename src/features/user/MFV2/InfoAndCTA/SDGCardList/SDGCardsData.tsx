import React from 'react';
import {
  AffordableAndCleanEnergyIcon,
  CleanWaterIcon,
  ClimateActionIcon,
  DecentWorkAndEconomicGrowthIcon,
  GenderEqualityIcon,
  GoodHealthAndWellBeingIcon,
  InfrastructureIcon,
  LifeBelowWaterIcon,
  LifeOnLandIcon,
  NoPovertyIcon,
  PartnershipIcon,
  PeaceIcon,
  QualityEducation,
  ReducedInequalityIcon,
  ResponsibleConsumptionAndProductionIcon,
  SustainableCommunitiesIcon,
  ZeroHungerIcon,
} from '../../../../../../public/assets/images/icons/SDGCardIcons';
import SingleSDGCard from './SingleSDGCard';
import { useTranslations } from 'next-intl';

const SDGElements = () => {
  const t = useTranslations('Profile');

  const cardsListData = [
    {
      title: t('infoAndCtaContainer.sdgCardTitle.noPoverty'),
      icon: <NoPovertyIcon />,
      color: '#EB4D5D',
    },
    {
      title: t('infoAndCtaContainer.sdgCardTitle.zeroHunger'),
      icon: <ZeroHungerIcon />,
      color: '#D8B060',
    },
    {
      title: t('infoAndCtaContainer.sdgCardTitle.goodHealthAndWellBeing'),
      icon: <GoodHealthAndWellBeingIcon />,
      color: '#5CAC6F',
    },
    {
      title: t('infoAndCtaContainer.sdgCardTitle.qualityEducation'),
      icon: <QualityEducation />,
      color: '#CC4F5F',
    },
    {
      title: t('infoAndCtaContainer.sdgCardTitle.genderEquality'),
      icon: <GenderEqualityIcon />,
      color: '#EF695C',
    },
    {
      title: t('infoAndCtaContainer.sdgCardTitle.cleanWater'),
      icon: <CleanWaterIcon />,
      color: '#58C0DD',
    },
    {
      title: t('infoAndCtaContainer.sdgCardTitle.cleanEnergy'),
      icon: <AffordableAndCleanEnergyIcon />,
      color: '#FBC764',
    },
    {
      title: t('infoAndCtaContainer.sdgCardTitle.economicGrowth'),
      icon: <DecentWorkAndEconomicGrowthIcon />,
      color: '#A44961',
    },
    {
      title: t(
        'infoAndCtaContainer.sdgCardTitle.industryInfrastructureAndInnovation'
      ),
      icon: <InfrastructureIcon />,
      color: '#F38A5A',
    },
    {
      title: t('infoAndCtaContainer.sdgCardTitle.reducedInequalities'),
      icon: <ReducedInequalityIcon />,
      color: '#D8B060',
    },
    {
      title: t('infoAndCtaContainer.sdgCardTitle.sustainableCities'),
      icon: <SustainableCommunitiesIcon />,
      color: '#F8AF5F',
    },
    {
      title: t(
        'infoAndCtaContainer.sdgCardTitle.responsibleConsumptionAndProduction'
      ),
      icon: <ResponsibleConsumptionAndProductionIcon />,
      color: '#D8A45C',
    },
    {
      title: t('infoAndCtaContainer.sdgCardTitle.climateAction'),
      icon: <ClimateActionIcon />,
      color: '#EF695C',
    },
    {
      title: t('infoAndCtaContainer.sdgCardTitle.lifeBelowWater'),
      icon: <LifeBelowWaterIcon />,
      color: '#4197C6',
    },
    {
      title: t('infoAndCtaContainer.sdgCardTitle.lifeOnLand'),
      icon: <LifeOnLandIcon />,
      color: '#80C571',
    },
    {
      title: t('infoAndCtaContainer.sdgCardTitle.peace'),
      icon: <PeaceIcon />,
      color: '#3A789F',
    },
    {
      title: t('infoAndCtaContainer.sdgCardTitle.partnership'),
      icon: <PartnershipIcon />,
      color: '#495F84',
    },
  ];

  return cardsListData.map((data, index) => (
    <SingleSDGCard
      key={index}
      title={data.title}
      icon={data.icon}
      index={index}
      color={data.color}
    />
  ));
};

export default SDGElements;
