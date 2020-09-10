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
          href="/t/[id]"
          as={`/t/${contactDetails[0].link}`}
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
      <div>
        {contactDetails.slice(1)[0].link ? (
          <a href={contactDetails.slice(1)[0].link} target="_blank">
            <div className={styles.infoText + ' ' + styles.contactDetailsRow}>
              {contactDetails.slice(1)[0].icon}
              <span
                style={{
                  marginLeft: '16px',
                  flexGrow: 1,
                  wordWrap: 'break-word',
                }}
              >
                {
                  contactDetails
                    .slice(1)[0]
                    .text.replace('http://', '')
                    .replace('https://', '')
                    .split(/[/?#]/)[0]
                }
              </span>
            </div>
          </a>
        ) : (
          <div className={styles.infoText + ' ' + styles.contactDetailsRow}>
            {contactDetails.slice(1)[0].icon}
            <span style={{ marginLeft: '16px', flexGrow: 1 }}>
              {contactDetails.slice(1)[0].text}
            </span>
          </div>
        )}
      </div>
      <div>
        {contactDetails.slice(1)[1].link ? (
          <a href={contactDetails.slice(1)[1].link} target="_blank">
            <div className={styles.infoText + ' ' + styles.contactDetailsRow}>
              {contactDetails.slice(1)[1].icon}
              <span
                style={{
                  marginLeft: '16px',
                  flexGrow: 1,
                  wordWrap: 'break-word',
                }}
              >
                {contactDetails.slice(1)[1].text}
              </span>
            </div>
          </a>
        ) : (
          <div className={styles.infoText + ' ' + styles.contactDetailsRow}>
            {contactDetails.slice(1)[1].icon}
            <span style={{ marginLeft: '16px', flexGrow: 1 }}>
              {contactDetails.slice(1)[1].text}
            </span>
          </div>
        )}
      </div>
      <div>
        {contactDetails.slice(1)[2].link ? (
          <a href={contactDetails.slice(1)[2].link} target="_blank">
            <div className={styles.infoText + ' ' + styles.contactDetailsRow}>
              {contactDetails.slice(1)[2].icon}
              <span
                style={{
                  marginLeft: '16px',
                  flexGrow: 1,
                  wordWrap: 'break-word',
                }}
              >
                {contactDetails.slice(1)[2].text}
              </span>
            </div>
          </a>
        ) : (
          <div className={styles.infoText + ' ' + styles.contactDetailsRow}>
            {contactDetails.slice(1)[2].icon}
            <span style={{ marginLeft: '16px', flexGrow: 1 }}>
              {contactDetails.slice(1)[2].text}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectContactDetails;
