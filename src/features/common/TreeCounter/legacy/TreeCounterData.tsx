import { localizedAbbreviatedNumber } from '../../../../utils/getFormattedNumber';
import { useLocale } from 'next-intl';
import treeCounterStyles from '../TreeCounter.module.scss';

interface HomeTreeCounterProps {
  planted: number | string | null;
  target: number | string | null;
}

const HomeTreeCounter = ({ planted, target }: HomeTreeCounterProps) => {
  const locale = useLocale();
  return (
    <>
      <div className={treeCounterStyles.tenantTreePlanted}>
        <div>{localizedAbbreviatedNumber(locale, Number(planted), 1)}</div>
        <div className={treeCounterStyles.label}>Trees Planted</div>
        <div>{localizedAbbreviatedNumber(locale, Number(target), 1)}</div>
        <div className={treeCounterStyles.label}>Target</div>
      </div>
    </>
  );
};

export default HomeTreeCounter;
