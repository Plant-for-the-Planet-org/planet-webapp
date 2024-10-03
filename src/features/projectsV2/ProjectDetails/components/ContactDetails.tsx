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
      shouldOpenNewTab: false,
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
      shouldOpenNewTab: true,
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
      shouldOpenNewTab: true,
    },
    {
      icon: <MailIcon width={10.5} color={`${'var(--primary-font-color)'}`} />,
      title: email,
      link: `mailto:${email}`,
      shouldOpenNewTab: false,
    },
  ];

  return (
    <div className={styles.contactDetailsContainer}>
      <SingleProjectInfoItem title={t('contactDetails')}>
        <div className={styles.contactText}>
          {contactDetails.length > 0 &&
            contactDetails.map((contact, index) => (
              <SingleContactDetail contactInfo={contact} key={index} />
            ))}
        </div>
      </SingleProjectInfoItem>
    </div>
  );
};

export default ContactDetails;
