import AnimatedButton from '../../../../features/common/InputTypes/AnimatedButton'
import TreeCounterSection from './TreeCounter'
import styles from './../styles/sateins.module.scss'
import React from 'react';
import { UserPropsContext } from '../../../../features/common/Layout/UserPropsContext';

export default function LandingSection(props: any) {
    const { token } = React.useContext(
        UserPropsContext
    );
    const getDonationUrl = (id: string, token: string | null): string => {
        const country = localStorage.getItem('countryCode');
        const language = localStorage.getItem('language');
        let directGift = localStorage.getItem('directGift');
        if (directGift) {
            directGift = JSON.parse(directGift);
        }
        const sourceUrl = `${process.env.NEXT_PUBLIC_DONATION_URL
            }/?to=${id}&callback_url=${window.location.href
            }&country=${country}&locale=${language}${token ? '&token=' + token : ''
            }&tenant=${process.env.TENANTID}${directGift ? '&s=' + directGift.id : ''}`;
        return sourceUrl;
    };
    const handleOpen = () => {
        const url = getDonationUrl(props.projectID, token);
        window.location.href = url;
    };
    return (
        <div className={styles.landingSection}>
            {/* <div className={styles.landingSectionOverlay}></div> */}

            <div className={styles.landingContent}>

                <div className={styles.landingTextSection}>
                    <h2>
                        <span>{props.LandingSectionData.mainTitleSubText}</span>
                    </h2>
                    <p>
                        {props.LandingSectionData.para}
                    </p>
                    <div className={styles.landingButtonContainer}>
                        <AnimatedButton onClick={handleOpen} className={styles.continueButton}>
                            Jetzt Bäume pflanzen
                        </AnimatedButton>
                        {/* <AnimatedButton onClick={() => props.handleViewProject()} className={styles.secondaryButton} style={{ marginLeft: '24px' }}>
                        Ver Proyecto {'>'}
                    </AnimatedButton> */}
                    </div>
                </div>
                {props.tenantScore && props.tenantScore.total && (
                    <div className={styles.landingImageSection}>
                        <TreeCounterSection tenantScore={props.tenantScore} />
                    </div>
                )}
            </div>


        </div>
    )
}