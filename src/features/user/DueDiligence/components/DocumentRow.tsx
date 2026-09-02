import type { ReactElement } from 'react';
import type { APIError } from '@planet-sdk/common';
import type { FileRejection } from 'react-dropzone';
import type { DocumentReference } from '../../../common/types/project';
import type { DueDiligenceDocument } from '../../../common/types/dueDiligence';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@mui/material';
import { handleError } from '@planet-sdk/common';
import { useTranslations } from 'next-intl';
import { clsx } from 'clsx';
import PDFRed from '../../../../../public/assets/images/icons/manageProjects/PDFRed';
import styles from '../DueDiligence.module.scss';
import { useApi } from '../../../../hooks/useApi';
import { useDocumentDownload } from '../utils/useDocumentDownload';
import { useErrorHandlingStore } from '../../../../stores';

/**
 * These six kinds all take a PDF of at most 25 MB, and the backend does not
 * publish either rule, so the picker repeats what the kinds say. The upload is
 * still refused server side if this drifts.
 */
const ACCEPTED_MIME_TYPE = 'application/pdf';
const MAX_BYTES = 25 * 1024 * 1024;

/** FileReader gives a data URI; the API takes the base64 payload on its own. */
function toBase64Payload(dataUrl: string): string {
  const commaIndex = dataUrl.indexOf(',');
  return commaIndex === -1 ? dataUrl : dataUrl.slice(commaIndex + 1);
}

interface Props {
  item: DueDiligenceDocument;
  onUploaded: (kind: string, current: DocumentReference) => void;
}

export default function DocumentRow({
  item,
  onUploaded,
}: Props): ReactElement {
  const t = useTranslations('Me.dueDiligence');
  const { postApiAuthenticated } = useApi();
  const setErrors = useErrorHandlingStore((state) => state.setErrors);
  const { openDocument, downloadingKind } = useDocumentDownload();
  const [isUploading, setIsUploading] = useState(false);
  const [rejection, setRejection] = useState<string | null>(null);

  const onDropAccepted = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setRejection(null);

      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event?.target?.result;
        if (typeof result !== 'string') return;

        setIsUploading(true);
        try {
          const uploaded = await postApiAuthenticated<
            DocumentReference,
            { content: string; filename: string; mimeType: string }
          >(`/app/profile/dueDiligence/documents/${item.kind}`, {
            payload: {
              content: toBase64Payload(result),
              filename: file.name,
              mimeType: file.type,
            },
          });
          onUploaded(item.kind, uploaded);
        } catch (err) {
          setErrors(handleError(err as APIError));
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    },
    [item.kind]
  );

  /** The picker drops a file that fails its own rules, so the row has to say why. */
  const onDropRejected = useCallback((rejections: FileRejection[]) => {
    const code = rejections[0]?.errors[0]?.code;
    setRejection(
      code === 'file-too-large'
        ? t('documentTooLarge', { maxMB: Math.floor(MAX_BYTES / 1024 / 1024) })
        : t('documentWrongType')
    );
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: ACCEPTED_MIME_TYPE,
    multiple: false,
    maxSize: MAX_BYTES,
    disabled: isUploading,
    onDropAccepted,
    onDropRejected,
  });

  const current = item.current;

  return (
    <div className={styles.documentRow}>
      <div className={styles.documentHeader}>
        <div className={styles.documentTitle}>
          <div className={styles.documentLabel}>
            <span>{item.label}</span>
            <span
              className={clsx(styles.badge, item.required && styles.required)}
            >
              {item.required ? t('required') : t('optional')}
            </span>
          </div>
          {item.note && <span className={styles.note}>{item.note}</span>}
        </div>

        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <Button variant="outlined" disabled={isUploading}>
            {isUploading
              ? t('uploading')
              : item.current
              ? t('replace')
              : t('upload')}
          </Button>
        </div>
      </div>

      {rejection && <span className={styles.error}>{rejection}</span>}

      {current ? (
        <button
          type="button"
          className={styles.fileLink}
          onClick={() => openDocument(item.kind, current.url)}
          disabled={downloadingKind === item.kind}
        >
          <PDFRed />
          <span>{current.filename}</span>
        </button>
      ) : (
        <span className={styles.missing}>{t('notUploaded')}</span>
      )}
    </div>
  );
}
