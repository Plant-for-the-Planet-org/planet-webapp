import LocationIcon from '../icons/LocationIcon';
import MailIcon from '../icons/MailIcon';
import RightArrowIcon from '../icons/RightArrowIcon';
import { ViewProfileIcon } from '../icons/ViewProfileIcon';
import WebsiteLinkIcon from '../icons/WebsiteLinkIcon';
import styles from './ProjectInfo.module.scss';

interface Props {
  websiteURL: string;
  location: string;
  email: string;
}

const ContactDetails = ({ websiteURL, location, email }: Props) => {
  const contactDetails = [
    {
      icon: <ViewProfileIcon />,
      title: 'View Profile',
      link: '',
    },
    {
      icon: <WebsiteLinkIcon />,
      title: websiteURL
        .replace('https://www.', '')
        .replace('http://', '')
        .replace('https://', '')
        .replace('https://www.', '')
        .split(/[/?#]/)[0],
      link: websiteURL,
    },
    {
      icon: <LocationIcon />,
      title: location,
      link: '',
    },
    {
      icon: <MailIcon />,
      title: email,
      link: `mailto:${email}`,
    },
  ];

  return (
    <div className={styles.contactDetailsContainer}>
      <div className={styles.singleInfo}>
        <div className={styles.halfInfo}>
          <div className={styles.infoTitle}>contact details</div>
          <div className={styles.contactText}>
            {contactDetails.map((contact, index) => (
              <a
                href={contact.link}
                target="_blank"
                key={index}
                rel="noreferrer"
                className={styles.singleContact}
              >
                <div className={styles.icon}>{contact.icon}</div>
                <div className={styles.title}>{contact.title}</div>
                <div className={styles.rightArrow}>
                  <RightArrowIcon />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;
