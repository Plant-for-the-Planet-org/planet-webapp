import Rating from '@material-ui/lab/Rating';
import {
    withStyles,
  } from '@material-ui/core/styles';


const MaterialRatings = withStyles({
    root: {
        '& .MuiRating-iconFilled': {
            color: '#87B738',
          },
    },
})(Rating);

export default MaterialRatings