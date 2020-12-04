import Link from 'next/link';
import React, { ReactElement } from 'react';
import styles from './../../styles/ProjectDetails.module.scss';
import i18next from '../../../../../i18n/';
import BlackTree from '../../../../../public/assets/images/icons/project/BlackTree';
import Email from '../../../../../public/assets/images/icons/project/Email';
import Location from '../../../../../public/assets/images/icons/project/Location';
import WorldWeb from '../../../../../public/assets/images/icons/project/WorldWeb';
const { useTranslation } = i18next;
interface Props {
  project: Object;
}

function ProjectContactDetails({ project }: Props): ReactElement {
  const { t } = useTranslation(['donate']);

  const contactAddress =
    project.tpo && project.tpo.address
      ? (project.tpo.address.address
          ? project.tpo.address.address + ', '
          : '') +
        (project.tpo.address.city ? project.tpo.address.city + ', ' : '') +
        (project.tpo.address.zipCode ? project.tpo.address.zipCode + ' ' : '') +
        (project.tpo.address.country
          ? t('country:' + project.tpo.address.country.toLowerCase())
          : '')
      : t('donate:unavailable');

  const projectWebsiteLink = project.website
    ? project.website.includes('http') || project.website.includes('https')
      ? project.website
      : `http://${project.website}`
    : t('donate:unavailable');

  const contactDetails = [
    {
      id: 1,
      icon: <BlackTree color={styles.highlightBackground} />,
      text: t('donate:viewProfile'),
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
        : t('donate:unavailable'),
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
        project.tpo && project.tpo.email
          ? project.tpo.email
          : t('donate:unavailable'),
      link:
        project.tpo && project.tpo.email ? `mailto:${project.tpo.email}` : null,
    },
  ];
  return (
    <div className={styles.projectMoreInfo}>
      <div className={styles.infoTitle}>{t('donate:contactDetails')}</div>
      <Link prefetch={false} href="/t/[id]" as={`/t/${contactDetails[0].link}`}>
        <div className={styles.infoText + ' ' + styles.contactDetailsRow}>
          {contactDetails[0].icon}
          <span style={{ marginLeft: '16px', flexGrow: 1 }}>
            {contactDetails[0].text}
          </span>
        </div>
      </Link>

      {contactDetails &&
        contactDetails.slice(1).map((contact) => {
          return (
            <a
              href={contact.link ? contact.link : '#'}
              target={contact.link ? '_blank' : '_self'}
            >
              <div className={styles.infoText + ' ' + styles.contactDetailsRow}>
                {contact.icon}
                <span>{contact.text}</span>
              </div>
            </a>
          );
        })}
    </div>
  );
}

export default ProjectContactDetails;
