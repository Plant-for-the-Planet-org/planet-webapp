import { Popup } from 'react-map-gl-v7';
import RegisteredTreePopupIcon from '../../../../../../public/assets/images/icons/myForestV2Icons/RegisteredTreePopupIcon';

const RegisteredTreePopup = ({ singleLocation }) => {
  return (
    <Popup
      latitude={singleLocation?.geometry?.coordinates[1]}
      longitude={singleLocation?.geometry?.coordinates[0]}
      offset={34}
    >
      <div
        style={{
          minWidth: '98px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <RegisteredTreePopupIcon />
        <div style={{ fontSize: '14px', fontWeight: '700', marginTop: '5px' }}>
          {'12 trees'}
        </div>
        <p style={{ fontSize: '8px', fontWeight: '600' }}>{'Registered'}</p>
        <div
          style={{
            color: 'rgba(130, 130, 130, 1)',
            fontSize: '8px',
            textTransform: 'capitalize',
            fontWeight: '600',
          }}
        >
          {'April 4, 2024'}
        </div>
      </div>
    </Popup>
  );
};

export default RegisteredTreePopup;
