import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import TreeDonation from '../src/features/donations/screens/TreeDonation';
import { project } from './mockData/projectData';

describe('tree donation', () => {
  const setIsTaxDeductible = jest.fn();
  it('it expects component to have some text', async() => {
    const { findByText } = render(<TreeDonation project={project} country="NG" setIsTaxDeductible={setIsTaxDeductible} treeCost="3" currency="NGN" />);
    const value = await findByText('Tree Donation');
    expect(value).toBeInTheDocument();
  });
  it('it expects component to be click', async() => {
    const setOpenTaxDeductionModal = jest.fn();
    const { findByTestId } = render(<TreeDonation project={project} country="NG" setIsTaxDeductible={setIsTaxDeductible} treeCost="3" currency="NGN" onClick={setOpenTaxDeductionModal()} />);
    const value = await findByTestId('taxDeductionId')
    expect(value).toBeTruthy();
    fireEvent.click(value);
    expect(setOpenTaxDeductionModal).toBeCalledTimes(1);
  });
});

