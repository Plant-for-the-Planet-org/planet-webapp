import { Popup } from 'react-map-gl-v7';
import style from '../MyForestV2.module.scss';
import getImageUrl from '../../../../../utils/getImageURL';

const ContributionPopup = ({ singleLocation }) => {
  return (
    <Popup
      latitude={singleLocation?.geometry?.coordinates[1]}
      longitude={singleLocation?.geometry?.coordinates[0]}
      className={style.contributionPopup}
      offset={65}
      closeButton={false}
    >
      <div className={style.contributionPopupContainer}>
        <div style={{ height: '94px' }}>
          <img
            alt="projectImage"
            src={getImageUrl(
              'project',
              'medium',
              singleLocation?.properties?.project.image
            )}
            width={'fit-content'}
            className={style.popupImage}
          />
        </div>
        <div
          style={{
            width: 'inherit',
            height: 'fit-content',
            justifyContent: 'space-between',
            borderBottomLeftRadius: '8px',
            borderBottomRightRadius: '8px',
            padding: '10px',
            display: 'flex',
            gap: '2px',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '10px',
                lineHeight: '166%',
                gap: '5px',
              }}
            >
              <p style={{ fontWeight: 700 }}>5 trees</p>
              <p
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 700,
                  marginBottom: '4px',
                }}
              >
                .
              </p>
              <p>Costa Rica</p>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '8px',
                gap: '3px',
                lineHeight: '0%',
                marginTop: '4px',
              }}
            >
              <p>Costa Rica</p>
              <p style={{ fontWeight: '700', marginBottom: '4px' }}>.</p>
              <p>By One Tree Planted</p>
            </div>
            <div style={{ fontSize: '7px', color: 'rgba(130, 130, 130, 1)' }}>
              Aug 25, 2021
            </div>
          </div>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2px 8px',
              fontSize: '10px',
              fontWeight: '700',
              color: '#fff',
              background: 'rgba(0, 122, 73, 1)',
              width: '53px',
              height: '18px',
              borderRadius: '4px',
            }}
          >
            Donate
          </button>
        </div>
      </div>
    </Popup>
  );
};

export default ContributionPopup;
