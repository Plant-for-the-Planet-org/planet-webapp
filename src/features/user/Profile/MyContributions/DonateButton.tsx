import WebappButton from '../../../common/WebappButton';
import { getDonationUrl } from '../../../../utils/getDonationUrl';
import styles from './MyContributions.module.scss';
import { useTenant } from '../../../common/Layout/TenantContext';
import { useUserProps } from '../../../common/Layout/UserPropsContext';

type SupportedDonationButton = {
  type: 'supported';
  supportedTreecounter: string;
};

type RegularDonationButton = {
  type: 'unsupported';
};

type DonateButtonProps = (SupportedDonationButton | RegularDonationButton) & {
  projectPurpose: 'trees' | 'conservation';
  projectSlug: string;
  contributionUnitType: 'tree' | 'm2';
  buttonText: string;
  customButtonClasses?: string;
};

const DonateButton = (props: DonateButtonProps) => {
  const {
    type,
    projectPurpose,
    projectSlug,
    contributionUnitType,
    buttonText,
    customButtonClasses,
  } = props;

  const { tenantConfig } = useTenant();
  const { token } = useUserProps();

  // Add custom styles depending on project purpose and unit type
  const buttonClasses = `${styles.donationButton} ${
    projectPurpose === 'conservation'
      ? styles.conservation
      : contributionUnitType === 'm2'
      ? styles.restoration
      : ''
  } ${customButtonClasses || ''}`;

  // Construct donate link
  const donateLink = getDonationUrl(
    tenantConfig.id,
    projectSlug,
    token,
    undefined,
    undefined,
    type === 'supported' ? props.supportedTreecounter : undefined
  );

  return (
    <WebappButton
      elementType="link"
      target="_blank"
      variant="tertiary"
      text={buttonText}
      href={donateLink}
      buttonClasses={buttonClasses}
    />
  );
};

export default DonateButton;
