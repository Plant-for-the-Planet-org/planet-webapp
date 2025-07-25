import { Button, styled } from '@mui/material';
import themeProperties from '../../../../theme/themeProperties';

const { fontSizes } = themeProperties;
const { colors } = themeProperties.designSystem;

const CustomButton = styled(Button)(() => ({
  '&.MuiButton-root': {
    flex: '0 0 auto',
    width: '240px',
    height: '47px',
    backgroundColor: colors.white,
    borderRadius: '12px',
    color: colors.coreText,
    justifyContent: 'start',
    paddingLeft: '18px',
    fontSize: `${fontSizes.fontXSmall}`,
    boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.12)',

    '&.active': {
      backgroundColor: colors.forestGreen,
      color: colors.white,
      svg: {
        path: { fill: colors.white },
      },
    },

    '& .MuiButton-startIcon': {
      marginLeft: '0px',
      svg: {
        width: '19px',
      },
    },

    '@media (max-width: 480px)': {
      width: 'fit-content',
      height: '28px',
      padding: '6px 8px',
      fontSize: `${fontSizes.fontXXSmall}`,
      borderRadius: '5px',
      '& .MuiButton-startIcon': {
        svg: {
          width: '14px',
        },
      },
    },
  },
}));

export default CustomButton;
