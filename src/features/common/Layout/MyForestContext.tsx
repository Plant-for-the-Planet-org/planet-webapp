import {
  FC,
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { PointFeature } from 'supercluster';
import { TestPointProps , ViewportProps } from '../types/map';
import { SetState } from '../types/common';
import { ContributionData , StatsResult } from '../types/myForest';

interface MyForestContextInterface {
  conservationProjectGeoJson: PointFeature<TestPointProps>[];
  setconservationProjectGeoJson: SetState<PointFeature<TestPointProps>[]>;
  treePlantationProjectGeoJson: PointFeature<TestPointProps>[];
  setTreePlantationProjectGeoJson: SetState<PointFeature<TestPointProps>[]>;
  conservationContribution: ContributionData | null;
  setConservationContribution: SetState<ContributionData | null>;
  treePlantationContribution: ContributionData | null;
  setTreePlantationContribution: SetState<ContributionData | null>;
  additionalInfoRelatedToContributions: StatsResult | undefined;
  setAdditionalInfoRelatedToContributions: SetState<StatsResult | undefined>;
  isConservedButtonActive: boolean;
  setIsConservedButtonActive: SetState<boolean>;
  isTreePlantedButtonActive: boolean;
  setIsTreePlantedButtonActive: SetState<boolean>;
  isProcessing: boolean;
  setIsProcessing: SetState<boolean>;
  showPopUp: boolean;
  setShowPopUp: SetState<boolean>;
  totalProjects: number | undefined;
  setTotalProjects: SetState<number | undefined>;
  totalDonations: number | undefined;
  setTotalDonations: SetState<number | undefined>;
  viewport: ViewportProps;
  setViewport: SetState<ViewportProps>;
}

const MyForestContext = createContext<MyForestContextInterface | null>(null);

export const MyForestProvider: FC = ({ children }) => {
  const [conservationProjectGeoJson, setconservationProjectGeoJson] = useState<
    PointFeature<TestPointProps>[]
  >([]);
  const [treePlantationProjectGeoJson, setTreePlantationProjectGeoJson] =
    useState<PointFeature<TestPointProps>[]>([]);
  const [conservationContribution, setConservationContribution] =
    useState<ContributionData | null>(null);
  const [treePlantationContribution, setTreePlantationContribution] =
    useState<ContributionData | null>(null);
  const [
    additionalInfoRelatedToContributions,
    setAdditionalInfoRelatedToContributions,
  ] = useState<StatsResult | undefined>(undefined);
  const [isConservedButtonActive, setIsConservedButtonActive] = useState(false);
  const [isTreePlantedButtonActive, setIsTreePlantedButtonActive] =
    useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const [totalProjects, setTotalProjects] = useState<number | undefined>(
    undefined
  );
  const [totalDonations, setTotalDonations] = useState<number | undefined>(
    undefined
  );
  const defaultMapCenter = [0, 0];
  const defaultZoom = 1;
  const [viewport, setViewport] = useState<ViewportProps>({
    width: '100%',
    height: '100%',
    latitude: defaultMapCenter[0],
    longitude: defaultMapCenter[1],
    zoom: defaultZoom,
  });

  useEffect(() => {
    if (
      treePlantationProjectGeoJson.length +
        conservationProjectGeoJson.length ===
      1
    ) {
      setViewport({
        ...viewport,
        latitude:
          treePlantationProjectGeoJson[0]?.geometry.coordinates[1] ||
          conservationProjectGeoJson[0]?.geometry.coordinates[1],
        longitude:
          treePlantationProjectGeoJson[0]?.geometry.coordinates[0] ||
          conservationProjectGeoJson[0]?.geometry.coordinates[0],
        zoom: 4,
      });
    }
  }, [treePlantationProjectGeoJson, conservationProjectGeoJson]);

  const value = useMemo(
    () => ({
      conservationProjectGeoJson,
      setconservationProjectGeoJson,
      treePlantationProjectGeoJson,
      setTreePlantationProjectGeoJson,
      conservationContribution,
      setConservationContribution,
      treePlantationContribution,
      setTreePlantationContribution,
      additionalInfoRelatedToContributions,
      setAdditionalInfoRelatedToContributions,
      isConservedButtonActive,
      setIsConservedButtonActive,
      isTreePlantedButtonActive,
      setIsTreePlantedButtonActive,
      isProcessing,
      setIsProcessing,
      showPopUp,
      setShowPopUp,
      totalDonations,
      setTotalDonations,
      totalProjects,
      setTotalProjects,
      viewport,
      setViewport,
    }),
    [
      conservationProjectGeoJson,
      setconservationProjectGeoJson,
      treePlantationProjectGeoJson,
      setTreePlantationProjectGeoJson,
      conservationContribution,
      setConservationContribution,
      treePlantationContribution,
      setTreePlantationContribution,
      additionalInfoRelatedToContributions,
      setAdditionalInfoRelatedToContributions,
      isConservedButtonActive,
      setIsConservedButtonActive,
      isTreePlantedButtonActive,
      setIsTreePlantedButtonActive,
      isProcessing,
      setIsProcessing,
      showPopUp,
      setShowPopUp,
      totalDonations,
      setTotalDonations,
      totalProjects,
      setTotalProjects,
      viewport,
      setViewport,
    ]
  );

  return (
    <MyForestContext.Provider value={value}>
      {children}
    </MyForestContext.Provider>
  );
};

export const useMyForest = () => {
  const context = useContext(MyForestContext);
  if (!context) {
    throw new Error('MyForestContext must be used within MyForestProvider');
  }
  return context;
};
