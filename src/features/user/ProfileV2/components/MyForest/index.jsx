import myForestStyles from '../../styles/MyForest.module.scss';
import { useTranslation } from 'next-i18next';
import {
  PlantedTreesSvg,
  ConservationTreeSvg,
  ArrowSvg,
  ProjectsSvg,
  CountriesSvg,
  DonationsSvg,
  EditTargetSvg,
  PlantedTreesGreenSvg,
} from '../../../../../../public/assets/images/ProfilePageIcons';
import Button from '@mui/material/Button';
import TreeCounter from '../../../../common/TreeCounter/TreeCounter';
import React from 'react';
import getImageUrl from '../../../../../utils/getImageURL';
import { getDonationUrl } from '../../../../../utils/getDonationUrl';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { ParamsContext } from '../../../../common/Layout/QueryParamsContext';

export const PlantedTreesAndRestorationInfo = ({
  plantedTrees,
  isTreePlantedButtonActive,
  setIsConservedButtonActive,
  setIsTreePlantedButtonActive,
}) => {
  const { t } = useTranslation(['donate']);
  const showTreesOnMap = () => {
    if (isTreePlantedButtonActive) {
      setIsTreePlantedButtonActive(false);
    } else {
      setIsTreePlantedButtonActive(true);
      setIsConservedButtonActive(false);
    }
  };
  return (
    <div
      className={`${
        isTreePlantedButtonActive
          ? myForestStyles.plantedTreesContainer
          : myForestStyles.plantedTreesContainerX
      }`}
      onClick={showTreesOnMap}
    >
      <div className={myForestStyles.plantedTreesLabelContainer}>
        <div>
          {isTreePlantedButtonActive ? (
            <PlantedTreesSvg />
          ) : (
            <PlantedTreesGreenSvg />
          )}
        </div>
        <div className={myForestStyles.plantedTreesLabel}>
          {t('donate:plantedTrees')}
        </div>
      </div>

      <div className={myForestStyles.countTrees}>
        <div>{`500`}</div>
      </div>
    </div>
  );
};

export const ConservedAreaInfo = ({
  setIsTreePlantedButtonActive,
  setIsConservedButtonActive,
  isConservedButtonActive,
}) => {
  const { t } = useTranslation(['donate']);
  const handleClick = () => {
    if (isConservedButtonActive) {
      setIsConservedButtonActive(false);
    } else {
      setIsTreePlantedButtonActive(false);
      setIsConservedButtonActive(true);
    }
  };
  return (
    <div
      className={myForestStyles.conservedAreaContainer}
      onClick={handleClick}
    >
      <div className={myForestStyles.labelContainer}>
        <div className={myForestStyles.conservedSvg}>
          <ConservationTreeSvg />
        </div>
        <div className={myForestStyles.conservedLabel}>
          {t('donate:conservation')}
        </div>
      </div>
      <div className={myForestStyles.conservedAreaValue}>
        <div style={{ fontSize: '36px', fontWeight: '700', color: '#48AADD' }}>
          395.4
        </div>
        <div className={myForestStyles.unit}>{'m²'}</div>
        <div className={myForestStyles.svgContainer}>
          <ArrowSvg />
        </div>
      </div>
    </div>
  );
};

export const OtherDonationInfo = ({ projects, countries, donations }) => {
  const { t } = useTranslation(['maps', 'me']);
  return (
    <div className={myForestStyles.donationDetailContainer}>
      <div className={myForestStyles.InfoContainer}>
        <div className={myForestStyles.labelContainer}>
          <div className={myForestStyles.svgContainer}>
            <ProjectsSvg />
          </div>
          <div className={myForestStyles.label}>{t('maps:projects')}</div>
        </div>
        <div className={myForestStyles.value}>{`${projects}`}</div>
      </div>
      <div className={myForestStyles.InfoContainer}>
        <div className={myForestStyles.labelContainer}>
          <div className={myForestStyles.svgContainer}>
            <CountriesSvg />
          </div>
          <div className={myForestStyles.label}>{t('maps:countries')}</div>
        </div>
        <div className={myForestStyles.value}>{`${countries}`}</div>
      </div>
      <div className={myForestStyles.InfoContainer}>
        <div className={myForestStyles.labelContainer}>
          <div className={myForestStyles.svgContainer}>
            <DonationsSvg />
          </div>
          <div className={myForestStyles.label}>{t('me:donations')}</div>
        </div>
        <div className={myForestStyles.value}>{`${donations}`}</div>
      </div>
    </div>
  );
};

export const DonationList = ({
  isConservedButtonActive,
  contributionProjectList,
}) => {
  const { token } = useUserProps();
  const { embed } = React.useContext(ParamsContext);
  const handleDonate = (slug) => {
    const url = getDonationUrl(slug, token);
    embed === 'true' ? window.open(url, '_top') : (window.location.href = url);
  };
  return (
    <div
      className={myForestStyles.donationlistContainer}
      style={{ marginTop: isConservedButtonActive ? '0px' : '340px' }}
    >
      {contributionProjectList.map((project) => {
        return (
          <div
            className={myForestStyles.donationDetail}
            key={project.plantProject.guid}
          >
            <div className={myForestStyles.image}>
              <img
                src={getImageUrl(
                  'project',
                  'medium',
                  project.plantProject.image
                )}
                width="100%"
                height="100%"
              />
            </div>
            <div className={myForestStyles.projectDetailContainer}>
              <div className={myForestStyles.projectDetail}>
                <div>
                  <p className={myForestStyles.projectName}>
                    {project.plantProject.name}
                  </p>
                  {/* <p>{project.plantProject.description}</p> */}
                </div>
                <div style={{ fontWeight: '700', fontSize: '14px' }}>
                  <p>{'Aug 25, 2021'}</p>
                </div>
              </div>
              <div className={myForestStyles.donateContainer}>
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                  {`${project.treeCount} trees`}
                </div>
                <div
                  className={myForestStyles.donate}
                  onClick={() => handleDonate(project.plantProject.guid)}
                >
                  {'Donate Again'}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const AreaPlantedAndRestored = (props) => {
  const { t } = useTranslation(['me']);
  const [addTargetModalOpen, setAddTargetModalOpen] = React.useState(false);
  return (
    <div className={myForestStyles.mainContainer}>
      <div className={myForestStyles.treeCounterContainer}>
        <div className={myForestStyles.treeCounter}>
          {' '}
          {props?.userprofile && (
            <TreeCounter
              handleAddTargetModalOpen={() => {
                setAddTargetModalOpen(true);
              }}
              authenticatedType={props.authenticatedType}
              target={props.userprofile?.score?.target}
              planted={
                props.userprofile?.type === 'tpo'
                  ? props.userprofile?.score.personal
                  : props.userprofile?.score.personal +
                    props.userprofile?.score.received
              }
            />
          )}
          <Button
            variant="contained"
            startIcon={<EditTargetSvg />}
            sx={{
              width: '126px',
              height: '31px',
              backgroundColor: '#219653',
              padding: '0px 0px',
              fontSize: '14px',
              fontWeight: 'bold',
              marginTop: '34px',
            }}
          >
            {t('me:editTarget')}
          </Button>
        </div>
      </div>
      <div className={myForestStyles.donationListMainContainer}>
        <div className={myForestStyles.text}>
          {t('me:treesPlantedAndAreaRestored')}
          <p className={myForestStyles.hrLine} />
        </div>
        <DonationList
          isConservedButtonActive={undefined}
          contributionProjectList={props.contribution}
        />
      </div>
    </div>
  );
};

export const AreaConserved = ({ isConservedButtonActive }) => {
  const { t } = useTranslation(['me']);
  return (
    <div className={myForestStyles.AreaConservedMainContainer}>
      <div className={myForestStyles.textContainer}>
        <div className={myForestStyles.conservedAreaText}>
          <p>{t('me:areaConserved')}</p>
          <p className={myForestStyles.hrLine} />
        </div>
      </div>
      <div className={myForestStyles.AreaConservedContainer}>
        <DonationList isConservedButtonActive={isConservedButtonActive} />
      </div>
    </div>
  );
};
