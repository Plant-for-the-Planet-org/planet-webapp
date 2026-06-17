import type { Meta, StoryObj } from '@storybook/react';
import ProjectSelectAutocomplete from '../../../common/ProjectSelectAutocomplete';

const meta: Meta<typeof ProjectSelectAutocomplete> = {
  title: 'Components/ProjectSelectAutocomplete',
  component: ProjectSelectAutocomplete,
};

export default meta;

type Story = StoryObj<typeof ProjectSelectAutocomplete>;

// cspell:disable
export const Default: Story = {
  args: {
    projectList: [
      {
        guid: 'proj_zD0ka2pSTr202yEj6SQFAzxF',
        name: 'RESTORATION OF THE BURNT TARAWE FOREST RESERVE-HANDENI,TANZANIA',
      },
      {
        guid: 'proj_ihLRpzg9Q6aLLyw6dlpMb8sA',
        name: 'A Million Trees for Ireland',
      },
      {
        guid: 'proj_i9BKPEvHj8nQ3m7x5htaEgi5',
        name: 'Ngulambarra',
      },
      {
        guid: 'proj_7OA3iSjhVGSngkNPXTvkSfHU',
        name: 'Santa Maria Coapan Reforestation 2023',
      },
      {
        guid: 'proj_z4VFz8QZq2suDRaydA14xYsO',
        name: 'Trees for Girls Education',
      },
      {
        guid: 'proj_ZGQ75IdDSkvLNpvTe4xv5VC8',
        name: "Riparian Reforestation with local farmers in Panama's Azuero Peninsula",
      },
      {
        guid: 'proj_TUDLVvXxraMY8O3xhx5jPcKf',
        name: 'World Garden Mongolia - Tuulpump',
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
      name: 'World Garden Mongolia - Tuulpump',
    },
    active: false,
  },
};
// cspell:enable
