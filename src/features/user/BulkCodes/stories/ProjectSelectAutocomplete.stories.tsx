import { Meta, StoryObj } from '@storybook/react';
import ProjectSelectAutocomplete from '../components/ProjectSelectAutocomplete';

const meta: Meta<typeof ProjectSelectAutocomplete> = {
  title: 'Components/ProjectSelectAutocomplete',
  component: ProjectSelectAutocomplete,
};

export default meta;

type Story = StoryObj<typeof ProjectSelectAutocomplete>;

export const Default: Story = {
  args: {
    projectList: [
      {
        guid: 'proj_zD0ka2pSTr202yEj6SQFAzxF',
        slug: 'http-www-inukayouth-org-1',
        name: 'RESTORATION OF THE BURNT TARAWE FOREST RESERVE-HANDENI,TANZANIA',
        unitCost: 0.35,
        currency: 'EUR',
        purpose: 'trees',
        allowDonations: true,
      },
      {
        guid: 'proj_ihLRpzg9Q6aLLyw6dlpMb8sA',
        slug: 'a-million-trees-for-ireland',
        name: 'A Million Trees for Ireland',
        unitCost: 10,
        currency: 'EUR',
        purpose: 'trees',
        allowDonations: true,
      },
      {
        guid: 'proj_i9BKPEvHj8nQ3m7x5htaEgi5',
        slug: 'ngulambarra',
        name: 'Ngulambarra',
        unitCost: 6.7,
        currency: 'EUR',
        purpose: 'trees',
        allowDonations: true,
      },
      {
        guid: 'proj_7OA3iSjhVGSngkNPXTvkSfHU',
        slug: 'santamariacoapan',
        name: 'Santa Maria Coapan Reforestation 2023',
        unitCost: 1,
        currency: 'EUR',
        purpose: 'trees',
        allowDonations: true,
      },
      {
        guid: 'proj_z4VFz8QZq2suDRaydA14xYsO',
        slug: 'treesforgirlseducation',
        name: 'Trees for Girls Education',
        unitCost: 3,
        currency: 'EUR',
        purpose: 'trees',
        allowDonations: true,
      },
      {
        guid: 'proj_ZGQ75IdDSkvLNpvTe4xv5VC8',
        slug: 'panamareforestation',
        name: "Riparian Reforestation with local farmers in Panama's Azuero Peninsula",
        unitCost: 5,
        currency: 'EUR',
        purpose: 'trees',
        allowDonations: true,
      },
      {
        guid: 'proj_TUDLVvXxraMY8O3xhx5jPcKf',
        slug: 'world-garden-mongolia-tuulpump',
        name: 'World Garden Mongolia - Tuulpump',
        unitCost: 8.22,
        currency: 'EUR',
        purpose: 'trees',
        allowDonations: true,
      },
    ],
  },
};

export const EmptyList: Story = {
  args: {
    projectList: [],
  },
};

export const ReadOnly: Story = {
  args: {
    ...Default.args,
    project: {
      guid: 'proj_TUDLVvXxraMY8O3xhx5jPcKf',
      slug: 'world-garden-mongolia-tuulpump',
      name: 'World Garden Mongolia - Tuulpump',
      unitCost: 8.22,
      currency: 'EUR',
      purpose: 'trees',
      allowDonations: true,
    },
    active: false,
  },
};
