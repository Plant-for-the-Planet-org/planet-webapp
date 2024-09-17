import React from 'react';
import { useTranslations } from 'next-intl';

interface Props {
  plantingSeasons: number[] | null;
}

const PlantingSeasons = ({ plantingSeasons }: Props) => {
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
      {plantingSeasons?.map((season, index) => {
        return (
          <span key={seasons[season - 1]}>
            {seasons[season - 1]}
            {index === plantingSeasons.length - 2 ? (
              <span> {tManageProjects('and')} </span>
            ) : index === plantingSeasons.length - 1 ? (
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

export default PlantingSeasons;
