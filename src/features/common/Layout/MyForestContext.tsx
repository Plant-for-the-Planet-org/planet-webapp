import { FC, createContext, useContext, useMemo, useState } from 'react';
import { PointFeature } from 'supercluster';
import { TestPointProps } from '../types/map';
import { SetState } from '../types/common';
import { ContributionData } from '../types/myForest';
import { StatsResult } from '../types/myForest';

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
  treePlantGeoJson: PointFeature<TestPointProps>[];
  setTreePlantGeoJson: SetState<PointFeature<TestPointProps>[]>;
  registeredTreeGeoJson: PointFeature<TestPointProps>[];
  setRegisteredTreeGeoJson: SetState<PointFeature<TestPointProps>[]>;
  restorationGeoJson: PointFeature<TestPointProps>[];
  setRestorationGeoJson: SetState<PointFeature<TestPointProps>[]>;
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
  const [treePlantGeoJson, setTreePlantGeoJson] = useState<
    PointFeature<TestPointProps>[]
  >([]);
  const [registeredTreeGeoJson, setRegisteredTreeGeoJson] = useState<
    PointFeature<TestPointProps>[]
  >([]);
  const [restorationGeoJson, setRestorationGeoJson] = useState<
    PointFeature<TestPointProps>[]
  >([]);

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
      treePlantGeoJson,
      setTreePlantGeoJson,
      registeredTreeGeoJson,
      setRegisteredTreeGeoJson,
      restorationGeoJson,
      setRestorationGeoJson,
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
      treePlantGeoJson,
      setTreePlantGeoJson,
      registeredTreeGeoJson,
      setRegisteredTreeGeoJson,
      restorationGeoJson,
      setRestorationGeoJson,
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
