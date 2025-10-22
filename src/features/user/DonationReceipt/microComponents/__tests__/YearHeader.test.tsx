import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import YearHeader from '../YearHeader';

// Mock translations
const messages = {
  DonationReceipt: {
    downloadOverview: 'Download Overview',
    downloadingOverview: 'Downloading...',
  },
};

const renderWithIntl = (component: React.ReactElement) => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>
  );
};

describe('YearHeader', () => {
  it('renders year title correctly', () => {
    renderWithIntl(
      <YearHeader year="2023" showOverviewLink={false} />
    );
    
    expect(screen.getByText('2023')).toBeInTheDocument();
  });

  it('shows overview link when showOverviewLink is true', () => {
    renderWithIntl(
      <YearHeader year="2023" showOverviewLink={true} />
    );
    
    expect(screen.getByText('Download Overview')).toBeInTheDocument();
  });

  it('does not show overview link when showOverviewLink is false', () => {
    renderWithIntl(
      <YearHeader year="2023" showOverviewLink={false} />
    );
    
    expect(screen.queryByText('Download Overview')).not.toBeInTheDocument();
  });

  it('calls onOverviewDownload when overview link is clicked', () => {
    const mockOnOverviewDownload = jest.fn();
    
    renderWithIntl(
      <YearHeader 
        year="2023" 
        showOverviewLink={true} 
        onOverviewDownload={mockOnOverviewDownload}
      />
    );
    
    const overviewButton = screen.getByText('Download Overview');
    fireEvent.click(overviewButton);
    
    expect(mockOnOverviewDownload).toHaveBeenCalledTimes(1);
  });

  it('shows loading state when isLoading is true', () => {
    renderWithIntl(
      <YearHeader 
        year="2023" 
        showOverviewLink={true} 
        isLoading={true}
      />
    );
    
    expect(screen.getByText('Downloading...')).toBeInTheDocument();
  });

  it('disables button when loading', () => {
    const mockOnOverviewDownload = jest.fn();
    
    renderWithIntl(
      <YearHeader 
        year="2023" 
        showOverviewLink={true} 
        onOverviewDownload={mockOnOverviewDownload}
        isLoading={true}
      />
    );
    
    const overviewButton = screen.getByRole('button');
    expect(overviewButton).toBeDisabled();
    
    fireEvent.click(overviewButton);
    expect(mockOnOverviewDownload).not.toHaveBeenCalled();
  });
});