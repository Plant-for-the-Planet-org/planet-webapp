import type { ReactElement } from 'react';
import type { APIError } from '@planet-sdk/common';
import type {
  ProjectDocumentsProps,
  DocumentChecklistItem,
} from '../../../common/types/project';

import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@mui/material';
import { handleError } from '@planet-sdk/common';
import { useTranslations } from 'next-intl';
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import PDFRed from '../../../../../public/assets/images/icons/manageProjects/PDFRed';
import styles from './../StepForm.module.scss';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import StyledForm from '../../../common/Layout/StyledForm';
import { ProjectCreationTabs } from '..';
import { useApi } from '../../../../hooks/useApi';
import { useErrorHandlingStore } from '../../../../stores/errorHandlingStore';
import ProjectLockedBanner from './microComponent/ProjectLockedBanner';
import AnnotationCallout from './microComponent/AnnotationCallout';
import { getMissingDocuments } from '../utils/completeness';
import { dedupeInFlight } from '../utils/dedupeInFlight';

/**
 * Strips the "data:<mime>;base64," prefix FileReader.readAsDataURL adds, so
 * the payload matches what the backend expects: raw base64 content, with
 * filename/mimeType taken straight from the File object rather than parsed
 * back out of the data URI.
 */
function toBase64Payload(dataUrl: string): string {
  const commaIndex = dataUrl.indexOf(',');
  return commaIndex === -1 ? dataUrl : dataUrl.slice(commaIndex + 1);
}

function DocumentRow({
  item,
  projectGUID,
  isLocked,
  onUploaded,
}: {
  item: DocumentChecklistItem;
  projectGUID: string;
  isLocked: boolean;
  onUploaded: (kind: string, current: DocumentChecklistItem['current']) => void;
}): ReactElement {
  const tManageProjects = useTranslations('ManageProjects');
  const { postApiAuthenticated } = useApi();
  const setErrors = useErrorHandlingStore((state) => state.setErrors);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event?.target?.result;
        if (typeof result !== 'string') return;

        setIsUploading(true);
        try {
          const res = await postApiAuthenticated<
            DocumentChecklistItem['current'],
            { content: string; filename: string; mimeType: string }
          >(`/app/projects/${projectGUID}/documents/${item.kind}`, {
            payload: {
              content: toBase64Payload(result),
              filename: file.name,
              mimeType: file.type,
            },
          });
          onUploaded(item.kind, res);
        } catch (err) {
          setErrors(handleError(err as APIError));
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    },
    [item.kind, projectGUID]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: '.pdf,.jpg,.jpeg,.png',
    multiple: false,
    maxSize: 10485760,
    disabled: isLocked || isUploading,
    onDropAccepted: onDrop,
  });

  return (
    <div
      style={{
        width: '100%',
        borderRadius: 10,
        backgroundColor: '#f6f6f4',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            flex: '1 1 260px',
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontWeight: 600 }}>{item.label}</span>
            <span
              style={{
                flexShrink: 0,
                fontSize: '0.75em',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                color: item.required ? '#c0392b' : '#888',
              }}
            >
              {item.required
                ? tManageProjects('documentRequired')
                : tManageProjects('documentOptional')}
            </span>
          </div>
          {item.note && (
            <span style={{ fontSize: '0.85em', color: '#888' }}>
              {item.note}
            </span>
          )}
        </div>

        {!isLocked && (
          <div {...getRootProps()} style={{ flexShrink: 0 }}>
            <input {...getInputProps()} />
            <Button
              variant="outlined"
              disabled={isUploading}
              style={{ whiteSpace: 'nowrap' }}
            >
              {isUploading
                ? tManageProjects('uploading')
                : item.current
                ? tManageProjects('documentReplace')
                : tManageProjects('documentUpload')}
            </Button>
          </div>
        )}
      </div>

      {item.comments.map((comment, index) => (
        <AnnotationCallout key={index} text={comment.body} />
      ))}

      {item.current ? (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={item.current.url}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            minWidth: 0,
          }}
        >
          <PDFRed />
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {item.current.filename}
          </span>
        </a>
      ) : (
        <span style={{ color: '#aaa', fontSize: '0.9em' }}>
          {tManageProjects('documentMissing')}
        </span>
      )}
    </div>
  );
}

export default function ProjectDocuments({
  handleBack,
  handleNext,
  projectGUID,
  isLocked,
  verificationStatus,
  onCompletenessChange,
}: ProjectDocumentsProps): ReactElement {
  const tManageProjects = useTranslations('ManageProjects');
  const tCommon = useTranslations('Common');
  const { getApiAuthenticated } = useApi();
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  const [checklist, setChecklist] = useState<DocumentChecklistItem[] | null>(
    null
  );
  const [notApplicable, setNotApplicable] = useState(false);

  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        const result = await dedupeInFlight(`documents-${projectGUID}`, () =>
          getApiAuthenticated<DocumentChecklistItem[]>(
            `/app/projects/${projectGUID}/documents`
          )
        );
        setChecklist(result);
      } catch (err) {
        // No document checklist for this project's purpose — nothing to show.
        if ((err as APIError)?.statusCode === 404) {
          setNotApplicable(true);
          return;
        }
        setErrors(handleError(err as APIError));
      }
    };
    if (projectGUID) void fetchChecklist();
  }, [projectGUID]);

  useEffect(() => {
    if (!checklist) return;
    onCompletenessChange?.(getMissingDocuments(checklist));
  }, [checklist]);

  const handleUploaded = (
    kind: string,
    current: DocumentChecklistItem['current']
  ) => {
    setChecklist(
      (prev) =>
        prev?.map((item) =>
          item.kind === kind ? { ...item, current, fulfilled: true } : item
        ) ?? null
    );
  };

  // A purpose with no document checklist at all (e.g. funds) has nothing to
  // show here — skip straight past this step rather than render an empty one.
  useEffect(() => {
    if (notApplicable) handleNext(ProjectCreationTabs.REVIEW);
  }, [notApplicable]);

  if (notApplicable) return <></>;

  return (
    <CenteredContainer>
      <StyledForm>
        {isLocked && verificationStatus && (
          <ProjectLockedBanner verificationStatus={verificationStatus} />
        )}
        {checklist === null ? (
          <div className={styles.spinner} />
        ) : (
          checklist.map((item) => (
            <DocumentRow
              key={item.kind}
              item={item}
              projectGUID={projectGUID}
              isLocked={isLocked}
              onUploaded={handleUploaded}
            />
          ))
        )}

        <div className={styles.buttonsForProjectCreationForm}>
          <Button
            onClick={() => handleBack(ProjectCreationTabs.QUESTIONNAIRE)}
            variant="outlined"
            className="formButton"
            startIcon={<BackArrow />}
          >
            <p>{tManageProjects('backToQuestionnaire')}</p>
          </Button>

          {!isLocked && (
            <Button
              onClick={() => handleNext(ProjectCreationTabs.REVIEW)}
              variant="contained"
              className="formButton"
            >
              {tCommon('continue')}
            </Button>
          )}
        </div>
      </StyledForm>
    </CenteredContainer>
  );
}
