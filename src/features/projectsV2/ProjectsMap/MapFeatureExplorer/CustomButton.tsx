import { Button, styled } from '@mui/material';
import theme from '../../../../theme/themeProperties';

const { fontSizes, light } = theme;

const CustomButton = styled(Button)(() => ({
  '&.MuiButton-root': {
    width: '182px',
    height: '47px',
    backgroundColor: `${light.light}`,
    borderRadius: '12px',
    color: 'black',
    justifyContent: 'start',
    paddingLeft: '18px',
    marginLeft: '5px',
    fontSize: `${fontSizes.fontXSmall}`,
    boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.12)',
  },
}));

export default CustomButton;
