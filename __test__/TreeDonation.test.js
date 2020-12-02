import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import TreeDonation from '../src/features/donations/screens/TreeDonation';
import { project } from './mockData/projectData';

describe('tree donation', () => {
  const setIsTaxDeductible = jest.fn();
  it('it expects component to have some text', () => {
    const { getByText } = render(<TreeDonation project={project} country="NG" setIsTaxDeductible={setIsTaxDeductible} treeCost="3" currency="NGN" />);
    expect(getByText('donate:treeDonation')).toBeInTheDocument();
  });
  it('it expects component to be click', () => {
    const set = jest.fn(()=> 'addd');
    const { getByTestId } = render(<TreeDonation project={project} country="NG" setIsTaxDeductible={setIsTaxDeductible} treeCost="3" currency="NGN" />);
    expect(getByTestId('taxDeductionId')).toBeTruthy();
    fireEvent.click(screen.getByTestId('taxDeductionId'));
    expect(set).toBeCalledTimes(1);
  });
});
