import React, { Fragment } from 'react';
import { useTranslation } from 'next-i18next';

interface Props {
  plantingSeasons: number[];
}

const PlantingSeasons = ({ plantingSeasons }: Props) => {
  const { t, ready } = useTranslation('common');
  const seasons = [
    { id: 0, title: ready ? t('common:january') : '' },
    { id: 1, title: ready ? t('common:february') : '' },
    { id: 2, title: ready ? t('common:march') : '' },
    { id: 3, title: ready ? t('common:april') : '' },
    { id: 4, title: ready ? t('common:may') : '' },
    { id: 5, title: ready ? t('common:june') : '' },
    { id: 6, title: ready ? t('common:july') : '' },
    { id: 7, title: ready ? t('common:august') : '' },
    { id: 8, title: ready ? t('common:september') : '' },
    { id: 9, title: ready ? t('common:october') : '' },
    { id: 10, title: ready ? t('common:november') : '' },
    { id: 11, title: ready ? t('common:december') : '' },
  ];

  return (
    <div>
      {plantingSeasons.map((season, index) => (
        <span key={seasons[season - 1].title}>
          {seasons[season - 1].title}
          {index === plantingSeasons.length - 2 ? (
            <span> {t('manageProjects:and')} </span>
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
