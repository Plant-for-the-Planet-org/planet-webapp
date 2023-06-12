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
} from '../../../../../../public/assets/images/ProfilePageIcons';
import Button from '@mui/material/Button';
import TreeCounter from '../../../../common/TreeCounter/TreeCounter';
import React from 'react';

export const PlantedTreesAndRestorationInfo = () => {
  const { t } = useTranslation(['donate']);
  return (
    <div className={myForestStyles.plantedTreesRestoredContainer}>
      <div className={myForestStyles.plantedTreesContainer}>
        <div className={myForestStyles.svgContainer}>
          <PlantedTreesSvg />
        </div>
        <div className={myForestStyles.plantedTreesLabel}>
          {t('donate:plantedTrees')}
        </div>

        <div className={myForestStyles.countTrees}>34</div>
      </div>
      <div className={myForestStyles.restoredAreaContainer}>
        <div className={myForestStyles.restoredAreaLabel}>
          {t('donate:restored')}
        </div>
      </div>
    </div>
  );
};

export const ConservedAreaInfo = () => {
  const { t } = useTranslation(['donate']);
  return (
    <div className={myForestStyles.conservedAreaContainer}>
      <div className={myForestStyles.labelContainer}>
        <div className={myForestStyles.conservedSvg}>
          <ConservationTreeSvg />
        </div>
        <div className={myForestStyles.conservedLabel}>
          {t('donate:conservation')}
        </div>
      </div>
      <div className={myForestStyles.conservedAreaValue}>
        <div className={myForestStyles.svgContainer}>
          <ArrowSvg />
        </div>
      </div>
    </div>
  );
};

export const OtherDonationInfo = () => {
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
        <div className={myForestStyles.value}>12</div>
      </div>
      <div className={myForestStyles.InfoContainer}>
        <div className={myForestStyles.labelContainer}>
          <div className={myForestStyles.svgContainer}>
            <CountriesSvg />
          </div>
          <div className={myForestStyles.label}>{t('maps:countries')}</div>
        </div>
        <div className={myForestStyles.value}>12</div>
      </div>
      <div className={myForestStyles.InfoContainer}>
        <div className={myForestStyles.labelContainer}>
          <div className={myForestStyles.svgContainer}>
            <DonationsSvg />
          </div>
          <div className={myForestStyles.label}>{t('me:donations')}</div>
        </div>
        <div className={myForestStyles.value}>12</div>
      </div>
    </div>
  );
};

export const DonationList = () => {
  return (
    <div className={myForestStyles.donationlistContainer}>
      <div className={myForestStyles.donationDetail}>
        <div className={myForestStyles.image}></div>
        <div className={myForestStyles.projectDetailContainer}>
          <div className={myForestStyles.projectDetail}>
            <div>
              <p className={myForestStyles.projectName}>
                {'Costa Rica - Ridge to Reef'}
              </p>
              <p>{'Costa Rica   By One Tree Planted'}</p>
            </div>
            <div style={{ fontWeight: '700', fontSize: '14px' }}>
              <p>{'Aug 25, 2021'}</p>
            </div>
          </div>
          <div className={myForestStyles.donateContainer}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
              {'5 trees'}
            </div>
            <div className={myForestStyles.donate}>{'Donate Again'}</div>
          </div>
        </div>
      </div>
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
        <DonationList />
      </div>
    </div>
  );
};

export const AreaConserved = () => {
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
        <DonationList />
      </div>
    </div>
  );
};
