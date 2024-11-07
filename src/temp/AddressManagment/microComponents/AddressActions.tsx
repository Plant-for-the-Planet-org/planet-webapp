import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button, Popover } from '@mui/material';
import KababMenuIcon from '../../../../public/assets/images/icons/KababMenuIcon';
import styles from '../AddressManagement.module.scss';
import { SetState } from '../../../features/common/types/common';

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

const AddressActions = ({ type, addressCount, setAddressAction }: Props) => {
  const t = useTranslations('Me');
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLButtonElement | null>(
    null
  );

  const addressActionConfig: AddressActionItem[] = [
    {
      label: t('addressManagement.edit'),
      action: ADDRESS_ACTIONS.EDIT,
      shouldRender: true,
    },
    {
      label: t('addressManagement.delete'),
      action: ADDRESS_ACTIONS.DELETE,
      shouldRender: addressCount > 1,
    },
    {
      label: t('addressManagement.setAsPrimaryAddress'),
      action: ADDRESS_ACTIONS.SET_PRIMARY,
      shouldRender: !(type === 'mailing' || type === 'primary'),
    },
    {
      label: t('addressManagement.setAsBillingAddress'),
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
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Button
        endIcon={<KababMenuIcon />}
        onClick={openPopover}
        className={styles.kababMenuButton}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={popoverAnchor}
        onClose={closePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
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

export default AddressActions;
