import type { ReactElement } from 'react';
import type { MissingField } from '../../../../common/types/project';

import type { SxProps } from '@mui/material';

import { Alert, Box, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import { fieldAnchorId } from '../../utils/completeness';

interface Props {
  fields: MissingField[];
  /** Sentence above the list, e.g. "3 answers are still missing". */
  title: string;
  /**
   * Given for summaries that point at another tab. Without it the entries jump
   * to the field on the current page instead.
   */
  hrefFor?: (key: string) => string;
  /**
   * 'warning' (default) is for fields blocking resubmission. 'info' is for a
   * purely informational list, such as answered fields a reviewer commented
   * on, that do not block anything.
   */
  severity?: 'warning' | 'info';
  sx?: SxProps;
}

function jumpToField(key: string): void {
  const target = document.getElementById(fieldAnchorId(key));
  if (!target) return;

  target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  // MUI puts the id on the input itself for text fields, and on the wrapper for
  // the table and checkbox group fields, so both cases have to be covered.
  const focusable = target.matches('input, textarea, select')
    ? target
    : target.querySelector<HTMLElement>('input, textarea, select, [tabindex]');
  focusable?.focus({ preventScroll: true });
}

export default function MissingFieldsSummary({
  fields,
  title,
  hrefFor,
  severity = 'warning',
  sx = { mb: 2 },
}: Props): ReactElement | null {
  if (fields.length === 0) return null;

  return (
    <Alert severity={severity} sx={sx}>
      {title}
      <Box
        component="ul"
        sx={{ m: 0, mt: 0.75, pl: 2.5, display: 'grid', gap: 0.25 }}
      >
        {fields.map(({ key, label }) => (
          <li key={key}>
            {hrefFor ? (
              <MuiLink
                component={Link}
                href={hrefFor(key)}
                underline="hover"
                sx={{ color: 'inherit' }}
              >
                {label}
              </MuiLink>
            ) : (
              <MuiLink
                component="button"
                type="button"
                onClick={() => jumpToField(key)}
                underline="hover"
                sx={{ color: 'inherit', font: 'inherit', textAlign: 'left' }}
              >
                {label}
              </MuiLink>
            )}
          </li>
        ))}
      </Box>
    </Alert>
  );
}
