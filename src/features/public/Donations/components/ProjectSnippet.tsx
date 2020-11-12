import Modal from '@material-ui/core/Modal';
import { Elements } from '@stripe/react-stripe-js';
import React, { ReactElement } from 'react';
import Sugar from 'sugar';
import getImageUrl from '../../../../utils/getImageURL';
import getStripe from '../../../../utils/stripe/getStripe';
import { ThemeContext } from '../../../../theme/themeContext';
import DonationsPopup from './../screens/DonationsPopup';
import styles from './../styles/Projects.module.scss';
import { useRouter } from 'next/router';
import i18next from '../../../../../i18n/'
import getFormatedCurrency from '../../../../utils/countryCurrency/getFormattedCurrency';
import EditIcon from '../../../../../public/assets/images/icons/manageProjects/Pencil';
import Link from 'next/link';

const { useTranslation } = i18next;
interface Props {
  project: any;
  key: number;
  directGift: any;
  setDirectGift: any;
  editMode: Boolean;
}

export default function ProjectSnippet({
  project,
  key,
  directGift,
  setDirectGift,
  editMode
}: Props): ReactElement {
  const router = useRouter();
  const { t, i18n } = useTranslation(['donate', 'common', 'country']);
  const [countryCode, setCountryCode] = React.useState<string>('DE');

  const ImageSource = project.properties.image
    ? getImageUrl('project', 'medium', project.properties.image)
    : '';

  const { theme } = React.useContext(ThemeContext);
  let progressPercentage =
    (project.properties.countPlanted / project.properties.countTarget) * 100;

  if (progressPercentage > 100) {
    progressPercentage = 100;
  }

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  React.useEffect(() => {
    const code = window.localStorage.getItem('countryCode') || 'DE';
    setCountryCode(code);
  });

  const projectDetails = project.properties;

  return (
    <div className={styles.singleProject} key={key}>
      <Modal
        className={styles.modal + ' ' + theme}
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        disableBackdropClick
      >
        <Elements stripe={getStripe()}>
          <DonationsPopup
            project={projectDetails}
            directGift={directGift}
            setDirectGift={setDirectGift}
            onClose={handleClose}
          />
        </Elements>
      </Modal>

      {editMode ? (
        <Link href={`/manage-projects/${project.properties.id}`}>
          <div className={styles.projectEditBlock}>
            <EditIcon></EditIcon>
          </div>
        </Link>
      ) : null}
      <div
        onClick={() => {
          router.push('/[p]', `/${project.properties.slug}`, {
            shallow: true,
          });
        }}
        className={styles.projectImage}
      >
        {project.properties.image &&
          typeof project.properties.image !== 'undefined' ? (
            <div
              className={styles.projectImageFile}
              style={{
                backgroundImage: `linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.4), rgba(0,0,0,0), rgba(0,0,0,0)),url(${ImageSource})`,
                backgroundPosition: 'center',
              }}
            ></div>
          ) : null}

        <div className={styles.projectImageBlock}>
          {/* <div className={styles.projectType}>
                {GetProjectClassification(project.properties.classification)}
              </div> */}
          <div className={styles.projectName}>
            {Sugar.String.truncate(project.properties.name, 54)}
          </div>
        </div>
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progressBarHighlight}
          style={{ width: progressPercentage + '%' }}
        />
      </div>
      <div className={styles.projectInfo}>
        <div className={styles.projectData}>
          <div className={styles.targetLocation}>
            <div className={styles.target}>
              {Sugar.Number.abbr(Number(project.properties.countPlanted), 1)}{' '}
              {t('common:planted')} •{' '}
              <span style={{ fontWeight: 400 }}>
                {t('country:' + project.properties.country.toLowerCase())}
              </span>
            </div>
          </div>
          <div className={styles.projectTPOName} onClick={() => {
                  router.push(`/t/${project.properties.tpo.slug}`);
                }}>
              {t('common:by')}{' '}{project.properties.tpo.name}
          </div>
        </div>

        {project.properties.allowDonations && (
          <div className={styles.projectCost}>
            {project.properties.treeCost ? (
              <>
                <div onClick={handleOpen} className={styles.donateButton}>
                  {t('common:donate')}
                </div>
                <div className={styles.perTreeCost}>
                  {getFormatedCurrency(
                    i18n.language,
                    project.properties.currency,
                    project.properties.treeCost
                  )}{' '}
                  <span>{t('donate:perTree')}</span>
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
