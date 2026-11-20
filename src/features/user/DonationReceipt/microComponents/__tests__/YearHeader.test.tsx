import type { ReactElement } from 'react';
import type { OverviewButtonState } from '../../donationReceiptTypes';

import { fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';
import messages from '../../../../../../public/static/locales/en/donationReceipt.json';
import YearHeader from '../YearHeader';

const renderWithIntl = (component: ReactElement) =>
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>
  );

const getDownloadButton = () =>
  screen.getByRole<HTMLButtonElement>('button', {
    name: 'Download overview for 2023',
  });

describe('YearHeader', () => {
  it('shows the year', () => {
    renderWithIntl(<YearHeader year="2023" overviewButtonState="hidden" />);

    expect(screen.getByRole('heading', { name: '2023' })).toBeTruthy();
  });

  it('hides the overview button and status label when the state is hidden', () => {
    renderWithIntl(<YearHeader year="2023" overviewButtonState="hidden" />);

    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.queryByText('Overview available')).toBeNull();
    expect(screen.queryByText('Overview not available yet')).toBeNull();
  });

  it('enables the button and calls onOverviewDownload when the state is active', () => {
    const onOverviewDownload = vi.fn();
    renderWithIntl(
      <YearHeader
        year="2023"
        overviewButtonState="active"
        onOverviewDownload={onOverviewDownload}
      />
    );

    const button = getDownloadButton();
    expect(button.disabled).toBe(false);
    expect(screen.getByText('Overview available')).toBeTruthy();

    fireEvent.click(button);
    expect(onOverviewDownload).toHaveBeenCalledOnce();
  });

  it.each<OverviewButtonState>(['inactive-unverified', 'inactive-future'])(
    'disables the button when the state is %s',
    (overviewButtonState) => {
      const onOverviewDownload = vi.fn();
      renderWithIntl(
        <YearHeader
          year="2023"
          overviewButtonState={overviewButtonState}
          onOverviewDownload={onOverviewDownload}
        />
      );

      const button = getDownloadButton();
      expect(button.disabled).toBe(true);
      expect(screen.getByText('Overview not available yet')).toBeTruthy();

      fireEvent.click(button);
      expect(onOverviewDownload).not.toHaveBeenCalled();
    }
  );

  it('disables the button and hides its label while loading', () => {
    const onOverviewDownload = vi.fn();
    renderWithIntl(
      <YearHeader
        year="2023"
        overviewButtonState="active"
        onOverviewDownload={onOverviewDownload}
        isLoading
      />
    );

    const button = getDownloadButton();
    expect(button.disabled).toBe(true);
    expect(screen.queryByText('Download Overview')).toBeNull();

    fireEvent.click(button);
    expect(onOverviewDownload).not.toHaveBeenCalled();
  });
});
