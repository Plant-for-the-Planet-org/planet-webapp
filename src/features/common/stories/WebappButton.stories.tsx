import type { Meta, StoryObj } from '@storybook/react';
import WebappButton from '../WebappButton';
import {
  ShareIcon,
  SupportUserIcon,
} from '../../../../public/assets/images/icons/ProfilePageV2Icons';

const meta: Meta<typeof WebappButton> = {
  component: WebappButton,
  title: 'Components/common/WebappButton',
  argTypes: {
    href: {
      if: { arg: 'elementType', eq: 'link' },
    },
    target: {
      if: { arg: 'elementType', eq: 'link' },
    },
    onClick: { if: { arg: 'elementType', eq: 'button' } },
  },
};

export default meta;

type Story = StoryObj<typeof WebappButton>;

const dummyOnClick = () => {
  window.alert('Button clicked!');
};

export const PrimaryTextOnly: Story = {
  args: {
    text: 'Primary Action',
    elementType: 'button',
    variant: 'primary',
    onClick: dummyOnClick,
  },
};

export const PrimaryWithIcon: Story = {
  args: {
    text: 'Primary Action',
    elementType: 'button',
    variant: 'primary',
    icon: <SupportUserIcon />,
    onClick: dummyOnClick,
  },
};

export const SecondaryTextOnly: Story = {
  args: {
    text: 'Secondary Action',
    elementType: 'button',
    variant: 'secondary',
    onClick: dummyOnClick,
  },
};

export const SecondaryWithIcon: Story = {
  args: {
    text: 'Secondary Action',
    elementType: 'button',
    variant: 'secondary',
    icon: <ShareIcon />,
    onClick: dummyOnClick,
  },
};

export const TertiaryTextOnly: Story = {
  args: {
    text: 'Tertiary Action',
    elementType: 'button',
    variant: 'tertiary',
    onClick: dummyOnClick,
  },
};

export const LinkPrimaryWithIcon: Story = {
  args: {
    text: 'Primary Link',
    elementType: 'link',
    href: 'https://web.plant-for-the-planet.org/',
    target: '_blank',
    variant: 'primary',
    icon: <SupportUserIcon />,
  },
};
