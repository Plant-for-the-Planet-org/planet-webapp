import React from 'react';
import { render } from '@testing-library/react';
import TreeDonation from '../src/features/donations/screens/TreeDonation';
import {project} from './mockData/projectData'

describe('tree donation', () => {
  it('it expects component to have some text', () => {
    const setIsTaxDeductible = jest.fn();
    const { getByText } = render(<TreeDonation project={project} country="NG" setIsTaxDeductible={setIsTaxDeductible} treeCost="3" currency="NGN"  />);
    expect(getByText('donate:treeDonation')).toBeInTheDocument();
  });
});
