import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import CancelIcon from '../../../../../../public/assets/images/icons/CancelIcon';
import styles from '../../styles/RegisterModal.module.scss';
import UploadImages from './UploadImages';

interface Props {
    session: any;
    contributionGUID: any;
    contribution: any;
    currentUserSlug: any;
}

const StaticMap = dynamic(() => import('./StaticMap'), {
    ssr: false,
    loading: () => <p></p>,
});

export default function SingleContribution({ session,
    contribution,
    contributionGUID, currentUserSlug }: Props): ReactElement {
    const router = useRouter();
    console.log(contribution);
    const UploadProps = {
        contribution, contributionGUID, session
    }

    const formatDate = (dateString: any) => {
        const options = { year: "numeric", month: "long", day: "numeric" }
        return new Date(dateString).toLocaleDateString(undefined, options)
    }
    return (
        <>
            <div
                className={styles.closeButton}
                onClick={() => {
                    router.push(`/t/${currentUserSlug}`, undefined, { shallow: true });
                }}
            >
                <CancelIcon />
            </div>
            <h2 className={styles.contribTitle}>

                <b> You planted {contribution.treeCount ? contribution.treeCount : '{null}'} {contribution.treeCount === 1 ? 'tree' : 'trees'} on {formatDate(contribution.plantDate)} </b>
            </h2>
            <div className={styles.contributionInfo}>

                <div className={styles.infoRow}>
                    <div className={styles.infoItem}>
                        <div className={styles.contributionTitle}>Contribution Information</div>
                        <div className={styles.infoLine}><b>Species : </b>{contribution.treeSpecies}</div>
                        <div className={styles.infoLine}><b>No of Trees : </b>{contribution.treeCount}</div>
                        <div className={styles.infoLine}><b>Date : </b>{contribution.plantDate}</div>
                    </div>
                    <div className={styles.infoItem}>
                        <div className={styles.previewMap}>
                            <StaticMap geoJson={contribution.geometry} />
                        </div></div>
                </div>
            </div>


            <div className={styles.uploadImages}>
                <UploadImages {...UploadProps} />
            </div>
        </>
    )
}
