import type {ImpersonationData} from '../../types/impersonation'

/**
 * Validates if an object is valid ImpersonationData.
 * Ensures both `targetEmail` and `supportPin` are strings.
 */
const isValidImpersonationData = (data: any): data is ImpersonationData => {
    return (
        data &&
        typeof data.targetEmail === 'string' &&
        typeof data.supportPin === 'string'
    );
};

/**
 * Merges provided impersonation data with local storage data.
 * Prioritizes provided data over local storage data if both are valid.
 * Returns null if neither is valid.
 */
const mergeImpersonationData = (
    localData: ImpersonationData | null,
    providedData?: ImpersonationData
): ImpersonationData | null => {
    const validLocalData = isValidImpersonationData(localData) ? localData : null;
    const validProvidedData = isValidImpersonationData(providedData) ? providedData : null;

    if (!validLocalData && !validProvidedData) {
        return null;
    }

    return validProvidedData || (validLocalData as ImpersonationData);
};

/**
 * Add the headers 'X-SWITCH-USER' and 'X-USER-SUPPORT-PIN' to the provided headers, if impersonation data is available.
 * Impersonation data can be provided as an argument or fetched from localStorage.
 * The provided impersonation data takes precedence over the localStorage data during the merge.
 */
export const setHeaderForImpersonation = (
    headers: Record<string, string>,
    impersonationData?: ImpersonationData
): Record<string, string> => {
    // Fetch impersonation data from localStorage
    const localStorageData: ImpersonationData | null = (() => {
        try {
            const data = localStorage.getItem('impersonationData');
            return data ? JSON.parse(data) : null;
        } catch (err) {
            console.warn('Invalid impersonation data in localStorage:', err);
            return null;
        }
    })();

    // Merge the provided data with the local storage data
    const mergedData = mergeImpersonationData(localStorageData, impersonationData);

    // If valid merged data exists, set headers
    if (mergedData) {
        headers['X-SWITCH-USER'] = mergedData.targetEmail;
        headers['X-USER-SUPPORT-PIN'] = mergedData.supportPin;
    }

    return headers;
};
