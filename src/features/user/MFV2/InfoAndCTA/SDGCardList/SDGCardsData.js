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
    title: 'noPoverty',
    icon: <NoPovertyIcon />,
    color: '#EB4D5D',
  },
  {
    title: 'zeroHunger',
    icon: <ZeroHungerIcon />,
    color: '#D8B060',
  },
  {
    title: 'goodHealthAndWellBeing',
    icon: <GoodHealthAndWellBeingIcon />,
    color: '#5CAC6F',
  },
  {
    title: 'qualityEducation',
    icon: <QualityEducation />,
    color: '#CC4F5F',
  },
  {
    title: 'genderEquality',
    icon: <GenderEqualityIcon />,
    color: '#EF695C',
  },
  {
    title: 'cleanWater',
    icon: <CleanWaterIcon />,
    color: '#58C0DD',
  },
  {
    title: 'cleanEnergy',
    icon: <AffordableAndCleanEnergyIcon />,
    color: '#FBC764',
  },
  {
    title: 'economicGrowth',
    icon: <DecentWorkAndEconomicGrowthIcon />,
    color: '#A44961',
  },
  {
    title: 'industryInfrastructureAndInnovation',
    icon: <InfrastructureIcon />,
    color: '#F38A5A',
  },
  {
    title: 'reducedInequalities',
    icon: <ReducedInequalityIcon />,
    color: '#D8B060',
  },
  {
    title: 'sustainableCities',
    icon: <SustainableCommunitiesIcon />,
    color: '#F8AF5F',
  },
  {
    title: 'responsibleConsumptionAndProduction',
    icon: <ResponsibleConsumptionAndProductionIcon />,
    color: '#D8A45C',
  },
  {
    title: 'climateAction',
    icon: <ClimateActionIcon />,
    color: '#EF695C',
  },
  {
    title: 'lifeBelowWater',
    icon: <LifeBelowWaterIcon />,
    color: '#4197C6',
  },
  {
    title: 'lifeOnLand',
    icon: <LifeOnLandIcon />,
    color: '#80C571',
  },
  {
    title: 'peace',
    icon: <PeaceIcon />,
    color: '#3A789F',
  },
  {
    title: 'partnership',
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
