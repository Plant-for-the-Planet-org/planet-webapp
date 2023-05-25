import { ReactElement } from 'react';
import themeProperties from '../../../../../src/theme/themeProperties';

interface Props {
  color?: string;
}

const TopProjectIcon = ({
  color = themeProperties.primaryColor,
}: Props): ReactElement => {
  return (
    <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.37532 2.69832L4.46774 0.321562C4.52826 0.192321 4.63115 0.0946031 4.75825 0.0410156C4.88534 -0.0125718 5.02757 -0.0125718 5.15467 0.0347112C5.28176 0.0851465 5.38768 0.182865 5.45123 0.308953L6.60115 2.6605C6.68285 2.82756 6.83718 2.94104 7.01572 2.96941L9.52436 3.31931C9.66054 3.33822 9.78461 3.41072 9.87237 3.52105C9.96012 3.63138 10.0055 3.77007 9.99946 3.91507C9.99341 4.05692 9.93591 4.19247 9.83908 4.29334L8.05368 6.15314C7.92658 6.28553 7.86908 6.47781 7.89935 6.66379L8.35629 9.25806C8.3805 9.39991 8.35326 9.54491 8.28063 9.66469C8.20801 9.78763 8.09302 9.87589 7.95987 9.91372C7.82672 9.95154 7.68449 9.93578 7.56345 9.87274L5.31202 8.6749C5.15164 8.58979 4.95797 8.58979 4.80061 8.6812L2.5734 9.92948C2.45235 9.99883 2.31013 10.0177 2.17698 9.98306C2.04383 9.94839 1.92581 9.86328 1.85016 9.7435C1.77451 9.62371 1.74425 9.47871 1.76543 9.33686L2.16487 6.73314C2.19211 6.54716 2.13159 6.35803 2.00146 6.22879L0.17067 4.40997C0.0738344 4.3091 0.0133123 4.17355 0.00120785 4.0317C-0.00787047 3.88986 0.034495 3.74801 0.119226 3.63453C0.203957 3.52105 0.328027 3.44855 0.464202 3.42648L2.96679 3.01985C3.14533 2.99148 3.29966 2.86854 3.37532 2.69832Z"
        fill={color}
      />
    </svg>
  );
};

export default TopProjectIcon;