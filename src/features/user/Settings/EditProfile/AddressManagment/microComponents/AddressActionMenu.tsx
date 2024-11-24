import type { SetState } from '../../../../../common/types/common';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Popover } from '@mui/material';
import KababMenuIcon from '../../../../../../../public/assets/images/icons/KababMenuIcon';
import styles from '../AddressManagement.module.scss';

export type AddressType = 'primary' | 'mailing' | 'other';
export const ADDRESS_ACTIONS = {
  EDIT: 'edit',
  DELETE: 'delete',
  SET_PRIMARY: 'setPrimary',
  SET_BILLING: 'setBilling',
} as const;

export type AddressAction =
  (typeof ADDRESS_ACTIONS)[keyof typeof ADDRESS_ACTIONS];

export interface AddressActionItem {
  label: string;
  action: AddressAction;
  shouldRender: boolean;
}
interface Props {
  type: AddressType;
  addressCount: number;
  setAddressAction: SetState<AddressAction | null>;
}

const AddressActionsMenu = ({
  type,
  addressCount,
  setAddressAction,
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
      shouldRender: !(type === 'mailing' || type === 'primary'),
    },
    {
      label: tProfile('actions.setAsBillingAddress'),
      action: ADDRESS_ACTIONS.SET_BILLING,
      shouldRender: !(type === 'mailing' || type === 'primary'),
    },
  ];

  const openPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPopoverAnchor(event.currentTarget);
  };

  const closePopover = () => {
    setPopoverAnchor(null);
  };

  const handleActionClick = (action: AddressAction) => {
    setAddressAction(action);
    setPopoverAnchor(null);
  };

  const open = Boolean(popoverAnchor);
  const id = open ? 'address-action-popOver' : undefined;

  return (
    <div>
      <button onClick={openPopover} className={styles.kebabMenuButton}>
        <KababMenuIcon />
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
