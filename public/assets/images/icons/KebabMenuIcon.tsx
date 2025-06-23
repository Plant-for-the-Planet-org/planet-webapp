import themeProperties from '../../../../src/theme/themeProperties';

const { coreText } = themeProperties.designSystem.colors;

const KebabMenuIcon = () => {
  return (
    <svg viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="2" width="4" height="4" rx="2" fill={coreText} />
      <rect x="4" y="8" width="4" height="4" rx="2" fill={coreText} />
      <rect x="4" y="14" width="4" height="4" rx="2" fill={coreText} />
    </svg>
  );
};

export default KebabMenuIcon;
