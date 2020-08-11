import Link from 'next/link';
import React, { ReactElement } from 'react';
import styles from './../../styles/ProjectDetails.module.scss';

interface Props {
  contactDetails: Array<{
    id: number;
    icon: JSX.Element;
    text: string;
    link: string;
  }>;
}

function ProjectContactDetails({ contactDetails }: Props): ReactElement {
  return (
    <div className={styles.projectMoreInfo}>
      <div className={styles.infoTitle}>Contact Details</div>
      {/* contactDetails tpo profile page link */}
      <div key={contactDetails[0].id}>
        <Link
          prefetch={false}
          href="/tpo/[id]"
          as={`/tpo/${contactDetails[0].link}`}
        >
          <a>
            <div className={styles.infoText + ' ' + styles.contactDetailsRow}>
              {contactDetails[0].icon}
              <span style={{ marginLeft: '16px', flexGrow: 1 }}>
                {contactDetails[0].text}
              </span>
            </div>
          </a>
        </Link>
      </div>

      {/* contactDetails website, maps, mail links */}
      {contactDetails.slice(1).map((contactDetails) => (
        <div key={contactDetails.id}>
          {contactDetails.link ? (
            <a href={contactDetails.link} target="_blank">
              <div className={styles.infoText + ' ' + styles.contactDetailsRow}>
                {contactDetails.icon}
                <span style={{ marginLeft: '16px', flexGrow: 1 }}>
                  {contactDetails.text.replace(/^https?:\/\//i, '')}
                </span>
              </div>
            </a>
          ) : (
            <div className={styles.infoText + ' ' + styles.contactDetailsRow}>
              {contactDetails.icon}
              <span style={{ marginLeft: '16px', flexGrow: 1 }}>
                {contactDetails.text}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ProjectContactDetails;
