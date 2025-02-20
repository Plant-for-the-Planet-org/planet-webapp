import { Button, styled } from '@mui/material';
import theme from '../../../../theme/themeProperties';

const { fontSizes, light, primaryColorNew } = theme;

const CustomButton = styled(Button)(() => ({
  '&.MuiButton-root': {
    flex: '0 0 auto',
    width: '240px',
    height: '47px',
    backgroundColor: `${light.light}`,
    borderRadius: '12px',
    color: 'black',
    justifyContent: 'start',
    paddingLeft: '18px',
    fontSize: `${fontSizes.fontXSmall}`,
    boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.12)',

    '&.active': {
      backgroundColor: `${primaryColorNew}`,
      color: `${light.light}`,
      svg: {
        path: { fill: `${light.light}` },
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
