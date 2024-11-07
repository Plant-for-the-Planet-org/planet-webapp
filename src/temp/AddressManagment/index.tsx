import type { Address } from '@planet-sdk/common';

import DashboardView from '../../features/common/Layout/DashboardView';
import SingleColumnView from '../../features/common/Layout/SingleColumnView';
import CenteredContainer from '../../features/common/Layout/CenteredContainer';
import { useTranslations } from 'next-intl';
import AddressList from './microComponents/AddressList';

export type AddressType = 'primary' | 'mailing' | 'other';

export interface UpdatedAddress extends Address {
  id: string;
  type: AddressType;
  name: string | null;
  state: string | null;
  isPrimary: boolean | null;
  address2: string | null;
}

interface Props {
  addresses: UpdatedAddress[];
}

const AddressManagement = ({ addresses }: Props) => {
  const t = useTranslations('Me');
  return (
    <DashboardView title={t('addressManagement.address')} subtitle={null}>
      <SingleColumnView>
        <CenteredContainer>
          <AddressList addresses={addresses} />
        </CenteredContainer>
      </SingleColumnView>
    </DashboardView>
  );
};

export default AddressManagement;
