import { render } from '@testing-library/react';
import TreeDonation from '../src/features/donations/screens/TreeDonation';

describe('tree donation', () => {
  it('it expects component not to render without props', () => {
    const { getByText } = render(<TreeDonation />);
    expect(getByText('trees')).toBeInTheDocument();
  });
});
