import React from 'react';
import { useTranslations } from 'next-intl';

interface Props {
  interventionSeasons: number[] | null;
}

const InterventionSeason = ({ interventionSeasons }: Props) => {
  const tCommon = useTranslations('Common');
  const tManageProjects = useTranslations('ManageProjects');

  const seasons = [
    tCommon('january'),
    tCommon('february'),
    tCommon('march'),
    tCommon('april'),
    tCommon('may'),
    tCommon('june'),
    tCommon('july'),
    tCommon('august'),
    tCommon('september'),
    tCommon('october'),
    tCommon('november'),
    tCommon('december'),
  ];
  return (
    <div>
      {interventionSeasons?.map((season, index) => {
        return (
          <span key={seasons[season - 1]}>
            {seasons[season - 1]}
            {index === interventionSeasons.length - 2 ? (
              <span> {tManageProjects('and')} </span>
            ) : index === interventionSeasons.length - 1 ? (
              '.'
            ) : (
              ', '
            )}
          </span>
        );
      })}
    </div>
  );
};

export default InterventionSeason;
