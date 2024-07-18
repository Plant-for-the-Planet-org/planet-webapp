import MailIcon from '../icons/MailIcon';
import { ViewProfileIcon } from '../icons/ViewProfileIcon';
import WebsiteLinkIcon from '../icons/WebsiteLinkIcon';
import styles from './ProjectInfo.module.scss';
import { useTranslations } from 'next-intl';
import SingleProjectInfoItem from './SingleProjectInfoItem';
import SingleContactDetail from './SingleContactDetail';
import LocationIconSolid from '../icons/LocationIconSolid';

interface Props {
  websiteURL: string;
  location: string;
  email: string;
  publicProfileURL: string;
}

const ContactDetails = ({
  publicProfileURL,
  websiteURL,
  location,
  email,
}: Props) => {
  const t = useTranslations('Donate');

  const extractWebsiteURLTitle = () => {
    return websiteURL
      .replace('https://www.', '')
      .replace('http://', '')
      .replace('https://', '')
      .replace('https://www.', '')
      .split(/[/?#]/)[0];
  };

  const contactDetails = [
    {
      icon: (
        <ViewProfileIcon
          width={10.5}
          color={`${'var(--primary-font-color)'}`}
        />
      ),
      title: t('viewProfile'),
      link: publicProfileURL,
    },
    {
      icon: (
        <WebsiteLinkIcon
          width={10.5}
          color={`${'var(--primary-font-color)'}`}
        />
      ),
      title: extractWebsiteURLTitle(),
      link: websiteURL,
    },
    {
      icon: (
        <LocationIconSolid
          width={9.5}
          color={`${'var(--primary-font-color)'}`}
        />
      ),
      title: location,
      link: '',
    },
    {
      icon: <MailIcon width={10.5} color={`${'var(--primary-font-color)'}`} />,
      title: email,
      link: `mailto:${email}`,
    },
  ];

  return (
    <div className={styles.contactDetailsContainer}>
      <SingleProjectInfoItem title={t('contactDetails')}>
        <div className={styles.contactText}>
          {contactDetails.map((contact, index) => (
            <SingleContactDetail contactInfo={contact} key={index} />
          ))}
        </div>
      </SingleProjectInfoItem>
    </div>
  );
};

export default ContactDetails;
