import React, { ReactElement } from 'react';
import styles from './../../styles/ProjectDetails.module.scss';
import Link from 'next/link';

interface Props {
  contactDetails: Array<{
    id: number;
    icon: JSX.Element;
    text: string;
    link: string;
  }>;
}

function ProjectContactDetails({ contactDetails }: Props): ReactElement {
  React.useEffect(() => {
    console.log('heree', contactDetails);
  });

  return (
    <div className={styles.projectMoreInfo}>
      <div className={styles.infoTitle}>Contact Details</div>
      {contactDetails.map((contactDetails) => (
        <div key={contactDetails.id}>
          <div className={styles.infoText + ' ' + styles.contactDetailsRow}>
            {contactDetails.icon}

            {contactDetails.link ? (
              <span style={{ marginLeft: '20px', flexGrow: 1 }}>
                <a href={contactDetails.link} target="_blank">
                  {contactDetails.text}
                </a>
              </span>
            ) : (
              <span style={{ marginLeft: '20px', flexGrow: 1 }}>
                {contactDetails.text}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProjectContactDetails;
