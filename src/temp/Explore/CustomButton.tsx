import { Button, styled } from '@mui/material';

const CustomButton = styled(Button)(({}) => ({
  '&.MuiButton-root': {
    width: '182px',
    height: '47px',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: '12px',
    color: 'black',
    justifyContent: 'start',
    paddingLeft: '18px',
    marginLeft: '5px',
    fontSize: '12px',
  },
}));

export default CustomButton;
