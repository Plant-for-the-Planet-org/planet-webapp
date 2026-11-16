import { Alert } from '@mui/material';

interface Props {
  text: string;
}

export default function AnnotationCallout({ text }: Props) {
  return (
    <Alert
      severity="warning"
      icon={false}
      sx={{
        mt: 0.25,
        mb: 0.5,
        py: 0.25,
        px: 1.5,
        backgroundColor: '#fefce8',
        color: '#713f12',
        border: '1px solid #fde68a',
        '& .MuiAlert-message': { padding: '4px 0' },
      }}
    >
      {text}
    </Alert>
  );
}
