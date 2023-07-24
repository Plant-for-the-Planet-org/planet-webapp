import React, { ReactElement, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { TENANT_ID } from '../../../utils/constants/environment';
import DashboardView from '../../common/Layout/DashboardView';
import StyledForm from '../../common/Layout/StyledForm';
import EmbedModal from './EmbedModal';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import styles from '../../common/Layout/UserLayout/UserLayout.module.scss';

export default function Widgets(): ReactElement | null {
  const { ready } = useTranslation('me');
  // External imports

  const { user, contextLoaded } = useUserProps();

  // Internal states
  const [profile, setProfile] = React.useState<null | Object>();

  useEffect(() => {
    if (user && contextLoaded) {
      setProfile(user);
    }
  }, [contextLoaded, user]);

  const [embedModalOpen, setEmbedModalOpen] = React.useState(false);

  const embedModalProps = { embedModalOpen, setEmbedModalOpen, user };

  React.useEffect(() => {
    if (user && user.isPrivate) {
      setEmbedModalOpen(true);
    }
  }, [user]);

  return ready ? (
    <DashboardView title={''} subtitle={null}>
      <StyledForm>
        {user?.isPrivate === false ? (
          <div className="inputContainer" style={{ padding: '0px' }}>
            <iframe
              src={`${process.env.WIDGET_URL}?user=${user?.id}&tenantkey=${TENANT_ID}`}
              className={styles.widgetIFrame}
            />
          </div>
        ) : (
          <EmbedModal {...embedModalProps} />
        )}
      </StyledForm>
    </DashboardView>
  ) : null;
}
