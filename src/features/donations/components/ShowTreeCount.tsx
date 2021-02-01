import React, { ReactElement } from 'react'
import getFormatedCurrency from '../../../utils/countryCurrency/getFormattedCurrency'
import i18next from '../../../../i18n';
import styles from '../styles/ContactDetails.module.scss';
import { getFormattedNumber } from '../../../utils/getFormattedNumber';


const { useTranslation } = i18next;

interface Props {
    treeCount: number;
    treeCost: number;
    currency: String;
    recurrencyMnemonic:String;
}

function ShowTreeCount({ treeCost,treeCount,currency,recurrencyMnemonic}: Props): ReactElement {
    const { t, i18n, ready } = useTranslation(['donate', 'common']);

    return (
        <div className={styles.finalTreeCount}>
            <div className={styles.totalCost}>
                {getFormatedCurrency(i18n.language, currency, treeCost * treeCount)}
            </div>
            <div className={styles.totalCostText}>
                {t(`donate:fortreeCountTrees${recurrencyMnemonic}`, {
                    treeCount: getFormattedNumber(i18n.language, Number(treeCount)),
                })}
            </div>
        </div>
    )
}

export default ShowTreeCount
