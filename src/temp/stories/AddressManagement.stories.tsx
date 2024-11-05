import type { Meta, StoryObj } from '@storybook/react';
import AddressManagement, { UpdatedAddress } from '../AddressManagment';

const meta: Meta<typeof AddressManagement> = {
  title: 'AddressManagement/AddressManagement',
  component: AddressManagement,
};

export default meta;
type Story = StoryObj<typeof AddressManagement>;

const address1: UpdatedAddress = {
  address: 'string',
  city: 'string',
  zipCode: 'string',
  country: 'DE',
  id: 'adr_U6sdZGo4a2rmzb1bMEw2F9PA',
  type: 'primary',
  name: 'primary',
  address2: null,
  state: null,
  isPrimary: true,
};

const address2: UpdatedAddress = {
  id: 'adr_4z4rf3oVe848vKEeC36LxWJq',
  type: 'mailing',
  address: 'mailing',
  address2: 'mailing address',
  city: 'Dullington',
  zipCode: '98212',
  country: 'CH',
  state: 'California',
  isPrimary: null,
  name: 'Home',
};

const addresses = [address1, address2];

export const Default: Story = {
  args: {
    addresses: addresses,
  },
};
