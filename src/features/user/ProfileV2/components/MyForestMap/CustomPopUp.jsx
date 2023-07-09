import { Popup } from 'react-map-gl';
import { Button } from '@mui/material';
// import { useContext } from 'react';
import { useTranslation } from 'next-i18next';
import MyForestMapStyle from '../../styles/MyForestMap.module.scss';
// import getImageUrl from '../../../../../utils/getImageURL';
// import { getDonationUrl } from '../../../../../utils/getDonationUrl';
// import { useUserProps } from '../../../../common/Layout/UserPropsContext';
// import { ParamsContext } from '../../../../common/Layout/QueryParamsContext';

const CustomPopUp = ({ projectInfo }) => {
  const { t, ready } = useTranslation(['me']);
  // const { token } = useUserProps();
  // const { embed } = useContext(ParamsContext);
  // const handleDonate = (slug) => {
  //   const url = getDonationUrl(slug, token);
  //   embed === 'true' ? window.open(url, '_top') : (window.location.href = url);
  // };
  return (
    ready &&
    projectInfo && (
      <div className={MyForestMapStyle.popUpMainContainer}>
        <Popup
          latitude={projectInfo.geometry.coordinates[1]}
          longitude={projectInfo.geometry.coordinates[0]}
          closeButton={false}
          tipSize={0}
          offsetTop={-10}
          offsetLeft={45}
        >
          <div className={MyForestMapStyle.donatePopUpContainer}>
            <div
              className={MyForestMapStyle.projectImageContainer}
              style={{ backgroundColor: 'green' }}
            >
              {/* <img
                src={getImageUrl(
                  'project',
                  'medium',
                  projectInfo.plantProject.image
                )}
                width="100%"
                height="100%"
              /> */}
              <div className={MyForestMapStyle.projectName}>
                {'Yucatan'}
                {/* {projectInfo.plantProject.name} */}
              </div>
            </div>
            <div className={MyForestMapStyle.projectInfoMainContainer}>
              <div className={MyForestMapStyle.projectInfoContainer}>
                <div className={MyForestMapStyle.area}>
                  {t('me:plantedTrees', {
                    noOfTrees: `${4}`,
                  })}
                </div>
                <div className={MyForestMapStyle.area}>.</div>
                <div>{'xyz'}</div>
                <Button
                  variant={'contained'}
                  sx={{
                    width: '53px',
                    height: '18px',
                    fontSize: '10px',
                    position: 'absolute',
                    left: '125px',
                    top: '-4px',
                  }}
                  // onClick={() => handleDonate(projectInfo.plantProject.guid)}
                >
                  {t('me:donate')}
                </Button>
              </div>
              <div className={MyForestMapStyle.tpo}>
                <p className={MyForestMapStyle.tpoName}>
                  {'testing'}
                  {/* {t('me:tpoName', {
                    tpo: `${projectInfo.plantProject.tpo.name}`,
                  })} */}
                </p>
                <p className={MyForestMapStyle.date}>{'Aug 25, 2021'}</p>
              </div>
            </div>
          </div>
        </Popup>
      </div>
    )
  );
};

export default CustomPopUp;
