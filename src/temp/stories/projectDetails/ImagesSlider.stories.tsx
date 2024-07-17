import type { Meta, StoryObj } from '@storybook/react';
import ImagesSlider from '../../ImagesSlider';

const meta: Meta<typeof ImagesSlider> = {
  title: 'Projects/Details/ImagesSlider',
  component: ImagesSlider,
};

export default meta;
type Story = StoryObj<typeof ImagesSlider>;

const images = [
  {
    image:
      'https://cdn.plant-for-the-planet.org/staging/media/cache/project/medium/5ecfc50da5d7d037154361.JPG',
    description:
      'Planting site: Trees in Las Americas 1, three years after planting',
    id: 'img_QLKW53tWrSKlvWwFVDmxBWUV',
  },
  {
    image:
      'https://cdn.plant-for-the-planet.org/staging/media/cache/project/medium/5ecfc50da5d7d037154361.JPG',
    description: 'Enrichment planting in San Felipe de Bacalar',
    id: 'img_AHfHqo0M7hU8CL60aI61jlyR',
  },
  {
    image:
      'https://cdn.plant-for-the-planet.org/staging/media/cache/project/medium/5ecfc50da5d7d037154361.JPG',
    description:
      'Newly established research with a capacity for 200,000 seedlings',
    id: 'img_JsTFMNG7sW2eFOQTjKB912M5',
  },
  {
    image:
      'https://cdn.plant-for-the-planet.org/staging/media/cache/project/medium/5ecfc50da5d7d037154361.JPG',
    description:
      'Seed collection in nearby forests, just before they are brought to the nurseries for germination',
    id: 'img_dtUPLG0GJqU4aZRW4o0ysBe2',
  },
  {
    image:
      'https://cdn.plant-for-the-planet.org/staging/media/cache/project/medium/5ecfc50da5d7d037154361.JPG',
    description: 'Celebrating the 8 millionth seedling planted in 2022',
    id: 'img_CmGvg0MlpVjg9PcMEwWNnECY',
  },
  {
    image:
      'https://cdn.plant-for-the-planet.org/staging/media/cache/project/medium/5ecfc50da5d7d037154361.JPG',
    description: 'Three reforesters preparing for a day of planting',
    id: 'img_UOKOZ3yxpsZyMArVUFNfFHrT',
  },
  {
    image:
      'https://cdn.plant-for-the-planet.org/staging/media/cache/project/medium/5ecfc50da5d7d037154361.JPG',
    description: 'Fire mitigation training',
    id: 'img_N7tUKN4ienoPBepPRzGFf6BQ',
  },
  {
    image:
      'https://cdn.plant-for-the-planet.org/staging/media/cache/project/medium/5ecfc50da5d7d037154361.JPG',
    description: 'Planting in Americás 7',
    id: 'img_Do6oePA5Hd2ZmR6FyberuOe6',
  },
];

export const Preview: Story = {
  args: {
    images: images,
    height: 195,
    imageSize: 'medium',
    type: 'project',
  },
};
