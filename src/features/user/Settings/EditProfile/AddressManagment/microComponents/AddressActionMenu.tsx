import type { SetState } from '../../../../../common/types/common';
import type { AddressAction } from '../../../../../common/types/profile';
import type { AddressType, Address } from '@planet-sdk/common';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Popover } from '@mui/material';
import KebabMenuIcon from '../../../../../../../public/assets/images/icons/KebabMenuIcon';
import styles from '../AddressManagement.module.scss';
import {
  ADDRESS_ACTIONS,
  ADDRESS_TYPE,
} from '../../../../../../utils/addressManagement';

export interface AddressActionItem {
  label: string;
  action: AddressAction;
  shouldRender: boolean;
}
interface Props {
  type: AddressType;
  addressCount: number;
  setAddressAction: SetState<AddressAction | null>;
  setIsModalOpen: SetState<boolean>;
  setSelectedAddressForAction: SetState<Address | null>;
  userAddress: Address;
}

const AddressActionsMenu = ({
  type,
  addressCount,
  setAddressAction,
  setIsModalOpen,
  setSelectedAddressForAction,
  userAddress,
}: Props) => {
  const tProfile = useTranslations('Profile.addressManagement');
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLButtonElement | null>(
    null
  );

  const addressActionConfig: AddressActionItem[] = [
    {
      label: tProfile(`actions.edit`),
      action: ADDRESS_ACTIONS.EDIT,
      shouldRender: true,
    },
    {
      label: tProfile(`actions.delete`),
      action: ADDRESS_ACTIONS.DELETE,
      shouldRender: addressCount > 1,
    },
    {
      label: tProfile('actions.setAsPrimaryAddress'),
      action: ADDRESS_ACTIONS.SET_PRIMARY,
      shouldRender: !(
        type === ADDRESS_TYPE.MAILING || type === ADDRESS_TYPE.PRIMARY
      ),
    },
    {
      label: tProfile('actions.setAsBillingAddress'),
      action: ADDRESS_ACTIONS.SET_BILLING,
      shouldRender: !(
        type === ADDRESS_TYPE.MAILING || type === ADDRESS_TYPE.PRIMARY
      ),
    },
  ];

  const openPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPopoverAnchor(event.currentTarget);
  };

  const closePopover = () => {
    setPopoverAnchor(null);
  };

  const handleActionClick = (action: AddressAction) => {
    setSelectedAddressForAction(userAddress);
    setIsModalOpen(true);
    setAddressAction(action);
    setPopoverAnchor(null);
  };

  const open = Boolean(popoverAnchor);
  const id = open ? 'address-action-popOver' : undefined;

  return (
    <div>
      <button onClick={openPopover} className={styles.kebabMenuButton}>
        <KebabMenuIcon />
      </button>
      <Popover
        id={id}
        open={open}
        anchorEl={popoverAnchor}
        onClose={closePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '12px',
          },
        }}
      >
        <ul className={styles.addressActions}>
          {addressActionConfig.map((item, key) => {
            if (!item.shouldRender) return;
            return (
              <li
                key={key}
                className={styles.action}
                onClick={() => handleActionClick(item.action)}
                role="button"
              >
                {item.label}
              </li>
            );
          })}
        </ul>
      </Popover>
    </div>
  );
};

export default AddressActionsMenu;
