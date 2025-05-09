import type { Meta, StoryObj } from '@storybook/react';
import NavbarMenuSection from '../microComponents/NavbarMenuSection';

const meta: Meta<typeof NavbarMenuSection> = {
  title: 'Components/NavbarMenu/NavbarMenuSection',
  component: NavbarMenuSection,
};

export default meta;
type Story = StoryObj<typeof NavbarMenuSection>;

export const NavbarMenuSectionView: Story = {
  args: {
    title: 'platform',
    sectionKey: 'platform',
    items: [
      {
        menuKey: 'treeMapper',
        title: 'treeMapper',
        link: 'https://www.plant-for-the-planet.org/partners/',
        description: 'treeMapperDescription',
        visible: true,
        onlyIcon: false,
      },
      {
        menuKey: 'fireAlert',
        title: 'fireAlert',
        link: 'https://www.plant-for-the-planet.org/partners/',
        description: 'fireAlertDescription',
        visible: true,
        onlyIcon: false,
      },
      {
        menuKey: 'tracer',
        title: 'tracer',
        link: 'https://www.plant-for-the-planet.org/partners/',
        description: 'tracerDescription',
        visible: true,
        onlyIcon: false,
      },
      {
        menuKey: 'restorationAdvice',
        title: 'restorationAdvice',
        link: 'https://www.plant-for-the-planet.org/partners/',
        description: 'restorationAdviceDescription',
        visible: true,
        onlyIcon: false,
      },
      {
        menuKey: 'restorationStandards',
        title: 'restorationStandards',
        link: 'https://www.plant-for-the-planet.org/partners/',
        description: 'restorationStandardsDescription',
        visible: true,
        onlyIcon: false,
      },
    ],
  },
};
