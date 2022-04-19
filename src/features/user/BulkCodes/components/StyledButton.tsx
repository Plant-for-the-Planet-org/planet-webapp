import { Button } from 'mui-latest';
import { styled } from 'mui-latest/styles';
import themeProperties from '../../../../theme/themeProperties';

const StyledButton = styled(Button)({
  textTransform: 'capitalize',
  backgroundColor: themeProperties.primaryColor,
  fontFamily: 'inherit',
  borderRadius: '18px',
  marginTop: '20px',
});

export default StyledButton;
