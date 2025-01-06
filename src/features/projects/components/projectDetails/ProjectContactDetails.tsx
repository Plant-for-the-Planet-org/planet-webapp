import type { ReactElement } from 'react';
import type {
  ConservationProjectExtended,
  TreeProjectExtended,
} from '@planet-sdk/common';

import Link from 'next/link';
import { ParamsContext } from '../../../common/Layout/QueryParamsContext';
import React from 'react';
import styles from './../../styles/ProjectDetails.module.scss';
import { useTranslations } from 'next-intl';
import BlackTree from '../../../../../public/assets/images/icons/project/BlackTree';
import Email from '../../../../../public/assets/images/icons/project/Email';
import Location from '../../../../../public/assets/images/icons/project/Location';
import WorldWeb from '../../../../../public/assets/images/icons/project/WorldWeb';

interface Props {
  project: TreeProjectExtended | ConservationProjectExtended;
}

function ProjectContactDetails({ project }: Props): ReactElement | null {
  const t = useTranslations('Donate');
  const tCountry = useTranslations('Country');
  const { embed } = React.useContext(ParamsContext);
  const contactAddress =
    project.tpo && project.tpo.address
      ? (project.tpo.address.address
          ? project.tpo.address.address + ', '
          : '') +
        (project.tpo.address.city ? project.tpo.address.city + ', ' : '') +
        (project.tpo.address.zipCode ? project.tpo.address.zipCode + ' ' : '') +
        (project.tpo.address.country
          ? tCountry(project.tpo.address.country.toLowerCase())
          : '')
      : t('unavailable');
  const projectWebsiteLink = project.website
    ? project.website.includes('http') || project.website.includes('https')
      ? project.website
      : `http://${project.website}`
    : t('unavailable');
  const contactDetails = [
    {
      id: 1,
      icon: <BlackTree color={styles.highlightBackground} />,
      text: t('viewProfile'),
      link: project.tpo.slug,
    },
    {
      id: 2,
      icon: <WorldWeb color={styles.highlightBackground} />,
      text: project.website
        ? project.website
            .replace('http://', '')
            .replace('https://', '')
            .split(/[/?#]/)[0]
        : t('unavailable'),
      link: projectWebsiteLink,
    },
    {
      id: 3,
      icon: <Location color={styles.highlightBackground} />,
      text: contactAddress,
      link: project.coordinates
        ? `https://maps.google.com/?q=${contactAddress}`
        : null,
    },
    {
      id: 4,
      icon: <Email color={styles.highlightBackground} />,
      text:
        project.tpo && project.tpo.email ? project.tpo.email : t('unavailable'),
      link:
        project.tpo && project.tpo.email ? `mailto:${project.tpo.email}` : null,
    },
  ];
  return (
    <div className={styles.projectContactDetails}>
      <div className={styles.projectMoreInfo}>
        <div className={styles.infoTitle}>{t('contactDetails')}</div>
        <Link
          prefetch={false}
          href="/t/[id]"
          as={`/t/${contactDetails[0].link}`}
          target={embed === 'true' ? '_top' : '_self'}
        >
          <div className={styles.infoText + ' ' + styles.contactDetailsRow}>
            {contactDetails[0].icon}
            <span style={{ flexGrow: 1, cursor: 'pointer' }}>
              {contactDetails[0].text}
            </span>
          </div>
        </Link>

        {contactDetails.slice(1).map((contact) => {
          return (
            <a
              key={contact.id}
              href={contact.link ? contact.link : '#'}
              target={contact.link ? '_blank' : '_self'}
              rel="noreferrer noopener"
            >
              <div className={styles.infoText + ' ' + styles.contactDetailsRow}>
                {contact.icon}
                <span>{contact.text}</span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default ProjectContactDetails;
