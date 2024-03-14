import type { Meta, StoryObj } from '@storybook/react';
import ProjectImagesSlider from '../ProjectImagesSlider';

const meta: Meta<typeof ProjectImagesSlider> = {
  component: ProjectImagesSlider,
};

export default meta;
type Story = StoryObj<typeof ProjectImagesSlider>;

const images = [
  {
    image: '62e8ddd64176a892668754.jpg',
    description:
      'Planting site: Trees in Las Americas 1, three years after planting',
    id: 'img_QLKW53tWrSKlvWwFVDmxBWUV',
  },
  {
    image: '62e8de02a5211241832960.jpg',
    description: 'Enrichment planting in San Felipe de Bacalar',
    id: 'img_AHfHqo0M7hU8CL60aI61jlyR',
  },
  {
    image: '62e8de19de81f610875390.jpg',
    description:
      'Newly established research with a capacity for 200,000 seedlings',
    id: 'img_JsTFMNG7sW2eFOQTjKB912M5',
  },
  {
    image: '62e8de447dd24209867854.jpg',
    description:
      'Seed collection in nearby forests, just before they are brought to the nurseries for germination',
    id: 'img_dtUPLG0GJqU4aZRW4o0ysBe2',
  },
  {
    image: '62e8deb170a16979936141.jpg',
    description: 'Celebrating the 8 millionth seedling planted in 2022',
    id: 'img_CmGvg0MlpVjg9PcMEwWNnECY',
  },
  {
    image: '62e8dedeb0493378877690.JPG',
    description: 'Three reforesters preparing for a day of planting',
    id: 'img_UOKOZ3yxpsZyMArVUFNfFHrT',
  },
  {
    image: '62e8df513b686307173619.jpg',
    description: 'Fire mitigation training',
    id: 'img_N7tUKN4ienoPBepPRzGFf6BQ',
  },
  {
    image: '62e8e1ec1cbe1201247937.jpg',
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
