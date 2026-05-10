import { Alert } from '@mui/material';
import { useTranslations } from 'next-intl';

interface Props {
  text: string;
}

export default function AnnotationCallout({ text }: Props) {
  const t = useTranslations('ManageProjects');
  return (
    <Alert severity="warning" sx={{ mt: 0.5, mb: 1 }}>
      <strong>{t('reviewerNote')}:</strong> {text}
    </Alert>
  );
}
