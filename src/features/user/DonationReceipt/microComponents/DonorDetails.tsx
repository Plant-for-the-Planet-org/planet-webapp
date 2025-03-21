import type { AddressView, DonorView } from '../donationReceiptTypes';
import type { CountryCode } from '@planet-sdk/common';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import styles from '../DonationReceipt.module.scss';
import { getFormattedAddress } from '../../../../utils/addressManagement';
import MissingDataIcon from '../../../../../public/assets/images/icons/MissingDataIcon';

interface Props {
  donor: DonorView;
  address: AddressView;
  isAddressInvalid: boolean;
}

const ErrorMessage = ({ message }: { message: string }) => (
  <div className={styles.errorMessageContainer}>
    <MissingDataIcon />
    <span className={styles.errorMessage}>{message}</span>
  </div>
);

const DonorName = ({ donor }: { donor: DonorView }) => {
  const tReceipt = useTranslations('DonationReceipt');
  return (
    <div className={styles.donorName}>
      <span className={styles.header}>
        {tReceipt('donorInfo.name', { type: donor.type })}
      </span>
      {!donor.name ? (
        <ErrorMessage
          message={tReceipt('notifications.nameMissing', { type: donor.type })}
        />
      ) : (
        <span>{donor.name}</span>
      )}
    </div>
  );
};

const DonorAddress = ({
  address,
  isAddressInvalid,
}: {
  address: AddressView;
  isAddressInvalid: boolean;
}) => {
  const tCountry = useTranslations('Country');
  const tReceipt = useTranslations('DonationReceipt');
  const { country, zipCode, city, address1, address2 } = address;
  const countryName = country
    ? tCountry(country.toLowerCase() as Lowercase<CountryCode>)
    : '';
  const cityStatePostalString = useMemo(
    () => getFormattedAddress(zipCode, city, null, countryName),
    [zipCode, city, countryName]
  );
  return (
    <div className={styles.addressInfo}>
      <span className={styles.header}>{tReceipt('donorInfo.address')}</span>
      {!isAddressInvalid ? (
        <address>
          {address1}, {cityStatePostalString}
        </address>
      ) : (
        <ErrorMessage message={tReceipt('notifications.addressMissing')} />
      )}
      {Boolean(address2) && (
        <address>
          {address2}, {cityStatePostalString}
        </address>
      )}
    </div>
  );
};

const DonorTIN = ({ tin, label }: { tin: string; label: string }) => {
  return (
    <div className={styles.tin}>
      <span className={styles.header}>{label}</span>
      <span>{tin}</span>
    </div>
  );
};

const DonorDetails = ({ donor, address, isAddressInvalid }: Props) => {
  const tReceipt = useTranslations('DonationReceipt');
  const isDonorContactInvalid = !donor.name || isAddressInvalid;
  return (
    <div className={styles.donorDetails}>
      <h3 className={styles.header}>{tReceipt('recipientInfoHeader')}</h3>
      <div className={styles.donorInfo}>
        <DonorName donor={donor} />
        {donor.tin !== null && (
          <DonorTIN
            tin={donor.tin}
            label={tReceipt('donationDetails.taxIdentificationNumber')}
          />
        )}
      </div>
      <DonorAddress address={address} isAddressInvalid={isAddressInvalid} />
      {isDonorContactInvalid && (
        <p>{tReceipt.rich('notifications.invalidContactInfoMessage')}</p>
      )}
    </div>
  );
};

export default DonorDetails;
