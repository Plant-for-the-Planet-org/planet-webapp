import { localizedAbbreviatedNumber } from '../../../../utils/getFormattedNumber';
import { useTranslation } from 'next-i18next';
import treeCounterStyles from '../TreeCounter.module.scss';

interface HomeTreeCounterProps {
  planted: number | string | null;
  target: number | string | null;
}

const HomeTreeCounter = ({ planted, target }: HomeTreeCounterProps) => {
  const { i18n } = useTranslation(['me']);
  return (
    <>
      <div className={treeCounterStyles.tenateTreePlanted}>
        <div>
          {localizedAbbreviatedNumber(i18n.language, Number(planted), 1)}
        </div>
        <div className={treeCounterStyles.label}>Trees Planted</div>
        <div>
          {localizedAbbreviatedNumber(i18n.language, Number(target), 1)}
        </div>
        <div className={treeCounterStyles.label}>Target</div>
      </div>
    </>
  );
};

export default HomeTreeCounter;
