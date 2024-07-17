import type { Meta, StoryObj } from '@storybook/react';
import ProjectDownloads from '../../ProjectInfo/ProjectDownloads';

const meta: Meta<typeof ProjectDownloads> = {
  title: 'Project Details/ProjectDownloads',
  component: ProjectDownloads,
};

export default meta;
type Story = StoryObj<typeof ProjectDownloads>;

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

const reports = [2013, 2022, 2021, 2019, 2018, 2017, 2016, 2014];

export const Preview: Story = {
  args: {
    certification: 'Consolata Machuko',
    spendings: expenses,
    progressReports: reports,
  },
};
