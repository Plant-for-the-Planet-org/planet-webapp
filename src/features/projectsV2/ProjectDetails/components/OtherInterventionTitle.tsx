import React from "react";
import type { INTERVENTION_TYPE } from "../../../../utils/constants/intervention";
import { AllInterventions, findInterventionHeader } from "../../../../utils/constants/intervention";
import { useTranslations } from "next-intl";


interface Props {
    type: string
}


const OtherInterventionTitle = ({ type }: Props) => {
    const tProjectDetails = useTranslations('ProjectDetails.intervention');
    const selectDynamicString = () => {
        switch (type) {
            case 'all':
                return tProjectDetails('all');
            case 'default':
                return tProjectDetails('default');
            case 'single-tree-registration':
                return tProjectDetails('single-tree-registration');
            case 'multi-tree-registration':
                return tProjectDetails('multi-tree-registration');
            case 'fire-suppression':
                return tProjectDetails('fire-suppression');
            case 'soil-improvement':
                return tProjectDetails('soil-improvement');
            case 'stop-tree-harvesting':
                return tProjectDetails('stop-tree-harvesting');
            case 'removal-invasive-species':
                return tProjectDetails('removal-invasive-species');
            case 'assisting-seed-rain':
                return tProjectDetails('assisting-seed-rain');
            case 'fencing':
                return tProjectDetails('fencing');
            case 'grass-suppression':
                return tProjectDetails('grass-suppression');
            case 'direct-seeding':
                return tProjectDetails('direct-seeding');
            case 'enrichment-planting':
                return tProjectDetails('enrichment-planting');
            case 'firebreaks':
                return tProjectDetails('firebreaks');
            case 'fire-patrol':
                return tProjectDetails('fire-patrol');
            case 'liberating-regenerant':
                return tProjectDetails('liberating-regenerant');
            case 'maintenance':
                return tProjectDetails('maintenance');
            case 'marking-regenerant':
                return tProjectDetails('marking-regenerant');
            case 'other-intervention':
                return tProjectDetails('other-intervention');
            default:
                ''
                break;
        }
    }
    const interventionTitle = selectDynamicString()
    return <span>{interventionTitle}</span>
}

export default OtherInterventionTitle