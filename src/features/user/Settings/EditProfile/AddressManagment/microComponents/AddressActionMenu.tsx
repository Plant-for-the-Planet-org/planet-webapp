import type { SetState } from '../../../../../common/types/common';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Popover } from '@mui/material';
import KababMenuIcon from '../../../../../../../public/assets/images/icons/KababMenuIcon';
import styles from '../AddressManagement.module.scss';
import {
  ADDRESS_ACTIONS,
  ADDRESS_FORM_TYPE,
  ADDRESS_TYPE,
} from '../../../../../../utils/addressManagement';
import { UpdatedAddress } from '..';

export type AddressType = (typeof ADDRESS_TYPE)[keyof typeof ADDRESS_TYPE];
export type AddressAction =
  (typeof ADDRESS_ACTIONS)[keyof typeof ADDRESS_ACTIONS];
export type AddressFormType =
  (typeof ADDRESS_FORM_TYPE)[keyof typeof ADDRESS_FORM_TYPE];

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
  setSelectedAddressForAction: SetState<UpdatedAddress | null>;
  userAddress: UpdatedAddress;
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
      label: tProfile(`actions.${ADDRESS_ACTIONS.EDIT}`),
      action: ADDRESS_ACTIONS.EDIT,
      shouldRender: true,
    },
    {
      label: tProfile(`actions.${ADDRESS_ACTIONS.DELETE}`),
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
