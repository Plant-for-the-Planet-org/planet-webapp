import type { Meta, StoryObj } from '@storybook/react';
import ItemImage from '../../MyContributions/ItemImage';

const meta: Meta<typeof ItemImage> = {
  component: ItemImage,
  title: 'Components/MyContributions/ItemImage',
};

export default meta;

type Story = StoryObj<typeof ItemImage>;

export const ImageWithoutGift: Story = {
  args: {
    imageUrl:
      'https://cdn.plant-for-the-planet.org/staging/media/cache/project/medium/5fc681619bcc7992543306.jpeg',
  },
};

export const ImageWithGift: Story = {
  args: {
    imageUrl:
      'https://cdn.plant-for-the-planet.org/staging/media/cache/project/medium/5fc681619bcc7992543306.jpeg',
    giftDetails: {
      giverName: 'Jane Doe',
    },
  },
};
