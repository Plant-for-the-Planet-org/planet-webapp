import React from 'react';
import { useTranslations } from 'next-intl';

interface Props {
  plantingSeasons: number[];
}

const PlantingSeasons = ({ plantingSeasons }: Props) => {
  const tCommon = useTranslations('Common');
  const tManageProjects = useTranslations('ManageProjects');

  const seasons = [
    { id: 0, title: tCommon('january') },
    { id: 1, title: tCommon('february') },
    { id: 2, title: tCommon('march') },
    { id: 3, title: tCommon('april') },
    { id: 4, title: tCommon('may') },
    { id: 5, title: tCommon('june') },
    { id: 6, title: tCommon('july') },
    { id: 7, title: tCommon('august') },
    { id: 8, title: tCommon('september') },
    { id: 9, title: tCommon('october') },
    { id: 10, title: tCommon('november') },
    { id: 11, title: tCommon('december') },
  ];

  return (
    <div>
      {plantingSeasons?.map((season, index) => (
        <span key={seasons[season - 1].title}>
          {seasons[season - 1].title}
          {index === plantingSeasons.length - 2 ? (
            <span> {tManageProjects('and')} </span>
          ) : index === plantingSeasons.length - 1 ? (
            '.'
          ) : (
            ', '
          )}
        </span>
      ))}
    </div>
  );
};

export default PlantingSeasons;
