import MailIcon from '../../../../../public/assets/images/icons/projectV2/MailIcon';
import { ViewProfileIcon } from '../../../../../public/assets/images/icons/projectV2/ViewProfileIcon';
import WebsiteLinkIcon from '../../../../../public/assets/images/icons/projectV2/WebsiteLinkIcon';
import styles from '../styles/ProjectInfo.module.scss';
import { useTranslations } from 'next-intl';
import SingleProjectInfoItem from './microComponents/SingleProjectInfoItem';
import SingleContactDetail from './microComponents/SingleContactDetail';
import LocationIconSolid from '../../../../../public/assets/images/icons/projectV2/LocationIconSolid';

interface Props {
  websiteURL: string | null;
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
    return (
      websiteURL &&
      websiteURL
        .replace('https://www.', '')
        .replace('http://', '')
        .replace('https://', '')
        .replace('https://www.', '')
        .split(/[/?#]/)[0]
    );
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
      link: `https://maps.google.com/?q=${location}`,
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
