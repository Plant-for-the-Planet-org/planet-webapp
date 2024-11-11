import type { Meta, StoryObj } from '@storybook/react';
import { addressType, type UpdatedAddress } from '..';

import AddressList from '../microComponents/AddressList';

const meta: Meta<typeof AddressList> = {
  title: 'AddressManagement/AddressManagement',
  component: AddressList,
};

export default meta;
type Story = StoryObj<typeof AddressList>;

const address1: UpdatedAddress = {
  address: 'Königsallee 45, Building A, Floor 3, Apartment 3C',
  city: 'Düsseldorf',
  zipCode: '40212',
  state: 'North Rhine-Westphalia',
  country: 'DE',
  id: 'adr_U6sdZGo4a2rmzb1bMEw2F9PA',
  type: 'primary',
  name: 'primary',
  address2: null,
  isPrimary: true,
};

const address2: UpdatedAddress = {
  address: 'Baker Street 221B, Building B, Floor 2, Apartment 5A',
  zipCode: 'NW1 6XE',
  city: 'London',
  state: 'Greater London',
  country: 'GB',
  id: 'adr_4z4rf3oVe848vKEeC36LxWJq',
  type: 'mailing',
  name: 'Home',
  address2: null,
  isPrimary: null,
};

const address3: UpdatedAddress = {
  address: 'Broadway 123, Suite 45',
  city: 'New York',
  zipCode: '10006',
  state: 'New York',
  country: 'US',
  id: 'adr_X2sdTGo9b4qvzq1bREw3D9YZ',
  type: 'other',
  name: 'office',
  address2: null,
  isPrimary: null,
};

const addresses = [address1, address2, address3].sort((a, b) => {
  return addressType.indexOf(a.type) - addressType.indexOf(b.type);
});

export const Default: Story = {
  args: {
    addresses: addresses,
  },
};
