import { useTranslations } from 'next-intl';
import themeProperties from '../../../../../theme/themeProperties';
import SlidePrevButtonIcon from '../../../../../../public/assets/images/icons/projectV2/SlidePrevButtonIcon';
import SlideNextButtonIcon from '../../../../../../public/assets/images/icons/projectV2/SlideNextButtonIcon';

interface SliderButtonProps {
  direction: 'prev' | 'next';
  disabled: boolean;
  onClick: () => void;
  className: string;
}

const SliderButton = ({
  direction,
  disabled,
  onClick,
  className,
}: SliderButtonProps) => {
  const { colors } = themeProperties.designSystem;
  const tImageSlider = useTranslations('ProjectDetails');
  const Icon = direction === 'prev' ? SlidePrevButtonIcon : SlideNextButtonIcon;
  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}
      aria-label={`${
        direction === 'prev'
          ? tImageSlider('previousImage')
          : tImageSlider('nextImage')
      }`}
    >
      <Icon color={disabled ? colors.mediumGrey : colors.primaryColor} />
    </button>
  );
};

export default SliderButton;
