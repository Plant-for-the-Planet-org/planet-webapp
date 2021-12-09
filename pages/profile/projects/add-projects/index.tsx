import i18next from '../../../../i18n';
import Link from 'next/link'
import React, { ReactElement } from 'react'
import UserLayout from '../../../../src/features/common/Layout/UserLayout/UserLayout';

interface Props {

}

export default function AddProjectType({ }: Props): ReactElement {
    const { useTranslation } = i18next;

    const { t, ready } = useTranslation(['donate', 'manageProjects']);

    return (
        <UserLayout>
            <div className={'add-project-title'}>
                <p>
                    {t('manageProjects:addProjetDescription')}
                </p>
                <span>
                    {t('manageProjects:supportLink')}
                </span>
            </div>
            <div className={'add-project'}>
                <Link href="/profile/projects/add-projects/restoration-project">
                    <button
                        id={'addProjectBut'}
                        className={'add-projects-button'}
                    >
                        {t('manageProjects:restorationProject')}
                    </button>
                </Link>
                <Link href="/profile/projects/add-conservation-project">
                    <button
                        id={'conservationProj'}
                        className={'add-projects-button'}
                    >
                        {t('manageProjects:conservationProject')}
                    </button>
                </Link>
            </div>
        </UserLayout>
    )
}
