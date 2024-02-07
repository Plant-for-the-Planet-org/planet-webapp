import type { Meta, StoryObj } from '@storybook/react';
import ProjectReview from '../ReviewReports/ProjectReview';

const meta: Meta<typeof ProjectReview> = {
  component: ProjectReview,
};

export default meta;
type Story = StoryObj<typeof ProjectReview>;

export const Preview: Story = {
  args: {
    pdf: '6453b5a357425095001115.pdf',
    issueMonth: '11-2021',
  },
};
