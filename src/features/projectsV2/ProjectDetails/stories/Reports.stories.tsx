import type { Meta, StoryObj } from '@storybook/react';
import ProjectReview from '../components/ReviewReports';

const meta: Meta<typeof ProjectReview> = {
  title: 'Projects/Common/ProjectReview',
  component: ProjectReview,
};

export default meta;
type Story = StoryObj<typeof ProjectReview>;

const reviews = [
  {
    pdf: '6453b5a357425095001115.pdf',
    issueMonth: '11-2021',
    id: '1234',
  },
  {
    pdf: '6453b5a357425095001115.pdf',
    issueMonth: '06-2021',
    id: '5678',
  },
];

export const Preview: Story = {
  args: {
    reviews: reviews,
  },
};
