import themeProperties from '../../../../src/theme/themeProperties';

function BackButton() {
  const { white, coreText } = themeProperties.designSystem.colors;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{
        backgroundColor: white,
        borderRadius: 30,
        marginTop: 10,
        marginLeft: 10,
      }}
      width="30"
      height="30"
      enableBackground="new 0 0 219.151 219.151"
      version="1.1"
      viewBox="0 0 219.151 219.151"
      xmlSpace="preserve"
    >
      <path
        fill={coreText}
        d="M94.861 156.507a7.502 7.502 0 0010.606 0 7.499 7.499 0 00-.001-10.608l-28.82-28.819 83.457-.008a7.5 7.5 0 00-.001-15l-83.46.008 28.827-28.825a7.5 7.5 0 00-10.607-10.608l-41.629 41.628a7.495 7.495 0 00-2.197 5.303 7.51 7.51 0 002.198 5.305l41.627 41.624z"
      ></path>
    </svg>
  );
}

export default BackButton;

//TODO: remove default margins as we need to compensate for them while using this icon
