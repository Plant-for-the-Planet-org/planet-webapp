import type { SetState } from '../../../../../common/types/common';
import type { AddressAction } from '../../../../../common/types/profile';
import type { Address } from '@planet-sdk/common';

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
  addressCount: number;
  setAddressAction: SetState<AddressAction | null>;
  setIsModalOpen: SetState<boolean>;
  setSelectedAddressForAction: SetState<Address | null>;
  userAddress: Address;
}

const AddressActionsMenu = ({
  addressCount,
  setAddressAction,
  setIsModalOpen,
  setSelectedAddressForAction,
  userAddress,
}: Props) => {
  const tAddressManagement = useTranslations('EditProfile.addressManagement');
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLButtonElement | null>(
    null
  );
  const { type } = userAddress;
  const addressActionConfig: AddressActionItem[] = [
    {
      label: tAddressManagement(`actions.edit`),
      action: ADDRESS_ACTIONS.EDIT,
      shouldRender: true,
    },
    {
      label: tAddressManagement(`actions.delete`),
      action: ADDRESS_ACTIONS.DELETE,
      shouldRender: addressCount > 1 && type !== ADDRESS_TYPE.PRIMARY,
    },
    {
      label: tAddressManagement('actions.setAsPrimaryAddress'),
      action: ADDRESS_ACTIONS.SET_PRIMARY,
      shouldRender: !(
        type === ADDRESS_TYPE.MAILING || type === ADDRESS_TYPE.PRIMARY
      ),
    },
    {
      label: tAddressManagement('actions.setAsBillingAddress'),
      action: ADDRESS_ACTIONS.SET_BILLING,
      shouldRender: !(
        type === ADDRESS_TYPE.MAILING || type === ADDRESS_TYPE.PRIMARY
      ),
    },
    {
      label: tAddressManagement('actions.unsetBillingAddress'),
      action: ADDRESS_ACTIONS.UNSET_BILLING,
      shouldRender: type === ADDRESS_TYPE.MAILING,
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
