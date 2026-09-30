import { Alert } from '@mui/material';
import { useTranslations } from 'next-intl';

interface ProjectLockedBannerProps {
  verificationStatus: string;
}

export default function ProjectLockedBanner({
  verificationStatus,
}: ProjectLockedBannerProps) {
  const t = useTranslations('ManageProjects');

  if (verificationStatus === 'submitted') {
    return <Alert severity="info">{t('projectLockedSubmitted')}</Alert>;
  }
  if (verificationStatus === 'in_review') {
    return <Alert severity="warning">{t('projectLockedInReview')}</Alert>;
  }
  if (verificationStatus === 'revision_requested') {
    return <Alert severity="warning">{t('projectRevisionRequested')}</Alert>;
  }

  return null;
}
