import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import CheckCircle from '../../../../../public/assets/images/icons/CheckCircle';
import styles from '../RegisterModal.module.scss';
import UploadImages from './UploadImages';
import { useTranslations } from 'next-intl';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import { Button } from '@mui/material';
import { Image } from '@planet-sdk/common';
import { Point, Polygon } from 'geojson';

export interface ContributionProperties {
  contributionImages: Image[];
  id: string;
  plantDate: string;
  plantProject: string | null;
  treeClassification: string | null;
  treeCount: number;
  treeScientificName: string | null;
  treeSpecies: string;
  geometry?: Polygon | Point;
}

interface SingleContributionProps {
  token: string | null;
  contribution: ContributionProperties | null;
  contributionGUID: string;
  slug?: string | null;
}

const StaticMap = dynamic(() => import('./StaticMap'), {
  ssr: false,
  loading: () => <p></p>,
});

export default function SingleContribution({
  token,
  contribution,
  contributionGUID,
}: SingleContributionProps): ReactElement {
  const router = useRouter();
  const UploadProps = {
    contributionGUID,
    token,
  };
  const t = useTranslations('Me');
  return contribution !== null ? (
    <div className="inputContainer">
      <div className={styles.checkMark}>
        <CheckCircle width="36px" color={`${styles.primaryColor}`} />
      </div>
      <h2 className={styles.contribTitle}>
        <b>
          {t('contribSuccess', {
            treeCount: contribution.treeCount,
            treeSpecies: contribution.treeSpecies,
            plantDate: formatDate(contribution.plantDate),
          })}
        </b>
      </h2>
      <div className={styles.contributionInfo}>
        <div className={styles.infoRow}>
          <div className={styles.infoItem}>
            <div className={styles.previewMap}>
              <StaticMap geoJson={contribution.geometry} />
            </div>
          </div>
        </div>
      </div>

      <div>
        <UploadImages {...UploadProps} />
      </div>
      <Button
        id="singleControCont"
        onClick={() => router.push('/profile')}
        variant="contained"
        color="primary"
        style={{ maxWidth: '100px', marginTop: '24px' }}
      >
        {t('save')}
      </Button>
    </div>
  ) : (
    <></>
  );
}
