import type { Meta, StoryObj } from '@storybook/react';
import ProjectDownloads from '../components/ProjectDownloads';

const meta: Meta<typeof ProjectDownloads> = {
  title: 'Projects/Details/ProjectDownloads',
  component: ProjectDownloads,
};

export default meta;
type Story = StoryObj<typeof ProjectDownloads>;

//cspell:disable
const expenses = [
  {
    amount: 356681,
    pdf: '5fb7c372bd504276646897.pdf',
    year: 2017,
    id: 'pexp_f108shsFDAyb',
  },
  {
    amount: 1802077,
    pdf: '5fd73c456d7a9928578563.pdf',
    year: 2018,
    id: 'pexp_4cF2SVDQ621t',
  },
  {
    amount: 4381306,
    pdf: '5fd73c5ff2d4c736307971.pdf',
    year: 2019,
    id: 'pexp_V7Wh82moUE5P',
  },
];
//cspell:enable

export const Preview: Story = {
  args: {
    certificates: [],
    expenses: expenses,
  },
};
