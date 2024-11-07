import type { UpdatedAddress } from '..';
import SingleAddress from './SingleAddress';

const AddressList = ({ addresses }: { addresses: UpdatedAddress[] }) => {
  return (
    <>
      {addresses.map((address) => (
        <SingleAddress key={address.id} userAddress={address} />
      ))}
    </>
  );
};

export default AddressList;
