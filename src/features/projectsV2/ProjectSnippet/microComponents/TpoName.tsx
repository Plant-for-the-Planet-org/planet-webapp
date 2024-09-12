import { useTranslations } from 'next-intl';
import styles from '../styles/ProjectSnippet.module.scss';

interface TpoNameProps {
  additionalClass?: string | undefined;
  handleClick: () => void;
  projectTpoName: string;
  tpoNameBackgroundClass: string;
}

const TpoName = ({
  additionalClass,
  handleClick,
  projectTpoName,
  tpoNameBackgroundClass,
}: TpoNameProps) => {
  const tCommon = useTranslations('Common');
  return (
    <div
      className={`${styles.projectTpoName} ${tpoNameBackgroundClass} ${additionalClass}`}
      onClick={handleClick}
    >
      {tCommon('by', { tpoName: projectTpoName })}
    </div>
  );
};

export default TpoName;
