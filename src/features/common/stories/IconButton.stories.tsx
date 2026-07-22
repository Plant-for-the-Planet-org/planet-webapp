import type { Meta, StoryObj } from '@storybook/react';

import { fn } from '@storybook/test';
import IconButton from '../IconButton';
import CloseIcon from '../../../../public/assets/images/icons/CloseIcon';

const DemoIcon = () => (
  <span style={{ display: 'inline-flex', width: 24, height: 24 }}>
    <CloseIcon />
  </span>
);

const meta: Meta<typeof IconButton> = {
  component: IconButton,
  title: 'Components/common/IconButton',
  parameters: {
    docs: {
      description: {
        component: [
          'Accessible icon-only button (or link). It bakes in the A11Y-002 pattern so',
          'it cannot be forgotten on new icon controls:',
          '',
          '- `label` is **required** and applied as `aria-label` — omitting it fails the type check.',
          '- `type="button"` is set by default (overridable).',
          '- `children` (the icon) is automatically hidden from assistive tech and kept layout-neutral.',
          '- All other native `<button>`/`<a>` props are forwarded; `className` is merged with the base reset.',
          '',
          '```tsx',
          '// Button (default) — label is required',
          "<IconButton label={t('close')} onClick={handleClose} className={styles.closeButton}>",
          '  <CloseIcon />',
          '</IconButton>',
          '',
          '// Link variant — internal paths are localized, external URLs render a plain <a>',
          '<IconButton',
          '  elementType="link"',
          "  label={t('facebook')}",
          '  href="https://facebook.com/..."',
          '  target="_blank"',
          '>',
          '  <FacebookIcon />',
          '</IconButton>',
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    label: {
      description: 'Accessible name, applied as `aria-label`. Required.',
    },
    elementType: {
      // Structural discriminator of the union, not an editable option. Each
      // story fixes it via args. Leaving it editable lets a toggle to 'link'
      // persist (Storybook URL args override story args) onto the Button
      // story, entering the link branch with no `href` → isExternalUrl(undefined)
      // crashes. Kept read-only in the table for documentation.
      control: false,
      description:
        'Renders a `<button>` (default) or a `<Link>`/`<a>`. Fixed per story.',
    },
    href: {
      // Read-only: clearing a link story's href would also enter the link
      // branch with an undefined href and crash the same way.
      control: false,
      if: { arg: 'elementType', eq: 'link' },
      description: 'Destination for the link variant.',
    },
    target: {
      control: false,
      if: { arg: 'elementType', eq: 'link' },
    },
    onClick: { if: { arg: 'elementType', eq: 'button' } },
  },
};

export default meta;

type Story = StoryObj<typeof IconButton>;

export const Button: Story = {
  args: {
    label: 'Close',
    elementType: 'button',
    children: <DemoIcon />,
  },
};

export const ButtonWithClickHandler: Story = {
  args: {
    label: 'Close',
    elementType: 'button',
    children: <DemoIcon />,
    // Logs clicks in the Storybook Actions panel.
    onClick: fn(),
  },
};

export const InternalLink: Story = {
  args: {
    label: 'Go to home',
    elementType: 'link',
    href: '/home',
    children: <DemoIcon />,
  },
};

export const ExternalLink: Story = {
  args: {
    label: 'Open Plant-for-the-Planet',
    elementType: 'link',
    href: 'https://www.plant-for-the-planet.org/',
    target: '_blank',
    children: <DemoIcon />,
  },
};
