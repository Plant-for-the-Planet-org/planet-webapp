import { Popup } from 'react-map-gl';
import { Button } from '@mui/material';
import MyForestMapStyle from '../../styles/MyForestMap.module.scss';

const CustomPopUp = ({ latitude, longitude }) => {
  return (
    <div className={MyForestMapStyle.popUpMainContainer}>
      <Popup
        latitude={latitude}
        longitude={longitude}
        closeButton={false}
        tipSize={0}
        offsetTop={189}
        offsetLeft={36}
      >
        <div className={MyForestMapStyle.donatePopUpContainer}>
          <div className={MyForestMapStyle.projectImageContainer}>
            {/* {image tag} */}
            <div className={MyForestMapStyle.projectName}>
              {'Yucatán Restoration'}
            </div>
          </div>
          <div className={MyForestMapStyle.projectInfoMainContainer}>
            <div className={MyForestMapStyle.projectInfoContainer}>
              <div className={MyForestMapStyle.area}>
                {'6.0 m2 restoration'}
              </div>
              <div className={MyForestMapStyle.area}>.</div>
              <div>{'Mexico'}</div>
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
              >
                {'donate'}
              </Button>
            </div>
            <div className={MyForestMapStyle.tpo}>
              <p className={MyForestMapStyle.tpoName}>
                {'By Plant-for-the-Planet'}
              </p>
              <p className={MyForestMapStyle.date}>{'Aug 25, 2021'}</p>
            </div>
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default CustomPopUp;
