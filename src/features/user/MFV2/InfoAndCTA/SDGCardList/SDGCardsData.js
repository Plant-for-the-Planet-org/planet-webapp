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

const cardsListData = [
  {
    title: 'NO POVERTY',
    icon: <NoPovertyIcon />,
    color: '#EB4D5D',
  },
  {
    title: 'ZERO HUNGER',
    icon: <ZeroHungerIcon />,
    color: '#D8B060',
  },
  {
    title: 'Good health and Well-being',
    icon: <GoodHealthAndWellBeingIcon />,
    color: '#5CAC6F',
  },
  {
    title: 'QUALITY EDUCATION',
    icon: <QualityEducation />,
    color: '#CC4F5F',
  },
  {
    title: 'GENDER EQUALITY',
    icon: <GenderEqualityIcon />,
    color: '#EF695C',
  },
  {
    title: 'CLEANWATER AND SANITATION',
    icon: <CleanWaterIcon />,
    color: '#58C0DD',
  },
  {
    title: 'AFFORDABLE AND CLEAN ENERGY',
    icon: <AffordableAndCleanEnergyIcon />,
    color: '#FBC764',
  },
  {
    title: 'DECENTWORK AND ECONOMIC GROWTH',
    icon: <DecentWorkAndEconomicGrowthIcon />,
    color: '#A44961',
  },
  {
    title: 'INDUSTRY, INNOVATION AND INFRASTRUCTURE',
    icon: <InfrastructureIcon />,
    color: '#F38A5A',
  },
  {
    title: 'REDUCED INEQUALITIES',
    icon: <ReducedInequalityIcon />,
    color: '#D8B060',
  },
  {
    title: 'SUSTAINABLE CITIES AND COMMUNITIES',
    icon: <SustainableCommunitiesIcon />,
    color: '#F8AF5F',
  },
  {
    title: 'RESPONSIBLE CONSUMPTION AND PRODUCTION',
    icon: <ResponsibleConsumptionAndProductionIcon />,
    color: '#D8A45C',
  },
  {
    title: 'CLIMATE ACTION',
    icon: <ClimateActionIcon />,
    color: '#EF695C',
  },
  {
    title: 'LIFE BELOW WATER',
    icon: <LifeBelowWaterIcon />,
    color: '#4197C6',
  },
  {
    title: 'LIFE ON LAND',
    icon: <LifeOnLandIcon />,
    color: '#80C571',
  },
  {
    title: ' PEACE, JUSTICE AND STRONG INSTITUTIONS',
    icon: <PeaceIcon />,
    color: '#3A789F',
  },
  {
    title: 'PARTNERSHIPS FOR THE GOALS',
    icon: <PartnershipIcon />,
    color: '#495F84',
  },
];

const sdgElements = cardsListData.map((data, index) => (
  <SingleSDGCard
    key={index}
    title={data.title}
    icon={data.icon}
    index={index}
    color={data.color}
  />
));

export default sdgElements;
