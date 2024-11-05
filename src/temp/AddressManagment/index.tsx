import type { Address } from '@planet-sdk/common';

export interface UpdatedAddress extends Address {
  id: string;
  type: 'primary' | 'mailing' | 'other';
  name: string | null;
  state: string | null;
  isPrimary: boolean | null;
  address2: string | null;
}

interface Props {
  addresses: UpdatedAddress[];
}

const AddressManagement = ({ addresses }: Props) => {
  return (
    <div>
      <div></div>
    </div>
  );
};

export default AddressManagement;
