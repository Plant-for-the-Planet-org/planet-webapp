import type { Meta, StoryObj } from '@storybook/react';
import ContactDetails from '../components/ContactDetails';

const meta: Meta<typeof ContactDetails> = {
  title: 'Projects/Details/ContactDetails',
  component: ContactDetails,
};

export default meta;
type Story = StoryObj<typeof ContactDetails>;

export const Preview: Story = {
  args: {
    websiteURL: 'https://www.facebook.com/bulindichimpanzees/',
    location: 'P.O. box 60-80208, gede-kilifi county, malindi, 80208 kenya',
    email: 'bccp@bulindichimpanzees.co.uk',
    publicProfileURL:
      'https://dev.pp.eco/t/the-bulindi-chimpanzee-community-project',
  },
};
