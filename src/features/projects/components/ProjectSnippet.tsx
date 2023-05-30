import React, { ReactElement } from 'react';
import getImageUrl from '../../../utils/getImageURL';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import getFormatedCurrency from '../../../utils/countryCurrency/getFormattedCurrency';
import EditIcon from '../../../../public/assets/images/icons/manageProjects/Pencil';
import Link from 'next/link';
import { localizedAbbreviatedNumber } from '../../../utils/getFormattedNumber';
import { truncateString } from '../../../utils/getTruncatedString';
import { ProjectPropsContext } from '../../common/Layout/ProjectPropsContext';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import { getDonationUrl } from '../../../utils/getDonationUrl';
import { ParamsContext } from '../../common/Layout/QueryParamsContext';
import VerifiedBadge from './VerifiedBadge';
import TopProjectBadge from './TopProjectBadge';

interface Props {
  project: any;
  editMode: boolean;
  displayPopup: boolean;
}

export default function ProjectSnippet({
  project,
  editMode,
  displayPopup,
}: Props): ReactElement {
  const router = useRouter();
  const { t, i18n, ready } = useTranslation(['donate', 'common', 'country']);
  const { embed, callbackUrl } = React.useContext(ParamsContext);
  const ImageSource = project.image
    ? getImageUrl('project', 'medium', project.image)
    : '';

  const { selectedPl, hoveredPl } = React.useContext(ProjectPropsContext);

  let progressPercentage = (project.countPlanted / project.countTarget) * 100;

  if (progressPercentage > 100) {
    progressPercentage = 100;
  }

  const { token } = useUserProps();
  const handleOpen = () => {
    const url = getDonationUrl(project.slug, token, embed, callbackUrl);
    embed === 'true' ? window.open(url, '_top') : (window.location.href = url);
  };
  return ready ? (
    <div className={'singleProject'}>
      {editMode ? (
        <Link href={`/profile/projects/${project.id}`}>
          <button id={'projectSnipEdit'} className={'projectEditBlock'}>
            <EditIcon></EditIcon>
          </button>
        </Link>
      ) : null}
      <div
        onClick={() => {
          router.push(
            `/${project.slug}/${
              embed === 'true'
                ? `${
                    callbackUrl != undefined
                      ? `?embed=true&callback=${callbackUrl}`
                      : '?embed=true'
                  }`
                : ''
            }`
          );
        }}
        className={`projectImage ${
          selectedPl || hoveredPl ? 'projectCollapsed' : ''
        }`}
      >
        {project.image && typeof project.image !== 'undefined' ? (
          <div
            className={'projectImageFile'}
            style={{
              backgroundImage: `linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.4), rgba(0,0,0,0), rgba(0,0,0,0)),url(${ImageSource})`,
              backgroundPosition: 'center',
            }}
          ></div>
        ) : null}
        {project.isTopProject && project.isApproved && (
          <TopProjectBadge displayPopup={true} />
        )}
        <div className={'projectImageBlock'}>
          <div className={'projectType'}>
            {project.classification && t(`donate:${project.classification}`)}
          </div>
          <p className={'projectName'}>
            {truncateString(project.name, 54)}
            {project.isApproved && (
              <VerifiedBadge displayPopup={displayPopup} project={project} />
            )}
          </p>
        </div>
      </div>

      <div className={'progressBar'}>
        <div
          className={'progressBarHighlight'}
          style={{ width: progressPercentage + '%' }}
        />
      </div>
      <div className={'projectInfo'}>
        <div className={'projectData'}>
          <div className={'targetLocation'}>
            <div className={'target'}>
              {project.purpose === 'trees' ? (
                <>
                  {localizedAbbreviatedNumber(
                    i18n.language,
                    Number(project.countPlanted),
                    1
                  )}{' '}
                  {t('common:tree', {
                    count: Number(project.countPlanted),
                  })}{' '}
                  •{' '}
                </>
              ) : (
                []
              )}
              <span style={{ fontWeight: 400 }}>
                {t('country:' + project.country.toLowerCase())}
              </span>
            </div>
          </div>
          <div
            className={'projectTPOName'}
            onClick={() => {
              embed === 'true'
                ? window.open(`/t/${project.tpo.slug}`, '_top')
                : router.push(`/t/${project.tpo.slug}`);
            }}
          >
            {t('common:by', {
              tpoName: project.tpo.name,
            })}
          </div>
        </div>

        {project.allowDonations && (
          <div className={'projectCost'}>
            {project.unitCost ? (
              <>
                <button
                  id={`ProjSnippetDonate_${project.id}`}
                  onClick={handleOpen}
                  className={'donateButton'}
                  data-test-id="donateButton"
                >
                  {t('common:donate')}
                </button>
                <div className={'perTreeCost'}>
                  {getFormatedCurrency(
                    i18n.language,
                    project.currency,
                    project.unitCost
                  )}{' '}
                  <span>
                    {project.purpose === 'conservation'
                      ? t('donate:perM2')
                      : t('donate:perTree')}
                  </span>
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  ) : (
    <></>
  );
}
