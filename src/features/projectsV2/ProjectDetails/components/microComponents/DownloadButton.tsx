import DownloadIcon from '../../../../../../public/assets/images/icons/projectV2/DownloadIcon';
import styles from '../../styles/ProjectInfo.module.scss';
import themeProperties from '../../../../../theme/themeProperties';

const DownloadsButton = ({ pdfUrl }: { pdfUrl: string }) => {
  return (
    <a
      className={styles.downloadIcon}
      href={pdfUrl}
      target="_blank"
      rel="noreferrer"
    >
      <DownloadIcon
        width={10}
        color={themeProperties.designSystem.colors.purpleSky}
      />
    </a>
  );
};

export default DownloadsButton;
