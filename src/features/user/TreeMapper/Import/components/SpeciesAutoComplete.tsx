/* eslint-disable no-use-before-define */
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React from 'react';
import { ThemeContext } from '../../../../../theme/themeContext';
import themeProperties from '../../../../../theme/themeProperties';
import tenantConfig from '../../../../../../tenant.config';
import MaterialTextField from '../../../../common/InputTypes/MaterialTextField';

const config = tenantConfig();

export default function SpeciesSelect(props: {
    label: React.ReactNode;
    inputRef: ((instance: any) => void) | React.RefObject<any> | null | undefined;
    name: string | undefined;
    defaultValue: String | undefined;
    mySpecies: [{ id: string; name: string, scientificName: string }];
    onChange:
    | ((
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void)
    | undefined;
}) {
    const [speciesSuggestion, setspeciesSuggestion] = React.useState(props.mySpecies);
    const { theme } = React.useContext(ThemeContext)
    const useStylesAutoComplete = makeStyles({
        paper: {
            color:
                theme === "theme-light"
                    ? `${themeProperties.light.primaryFontColor} !important`
                    : `${themeProperties.dark.primaryFontColor} !important`,
            backgroundColor:
                theme === "theme-light"
                    ? `${themeProperties.light.backgroundColor} !important`
                    : `${themeProperties.dark.backgroundColor} !important`,
        },
        option: {
            // color: '#2F3336',
            fontFamily: config!.font.primaryFontFamily,
            "&:hover": {
                backgroundColor:
                    theme === "theme-light"
                        ? `${themeProperties.light.backgroundColorDark} !important`
                        : `${themeProperties.dark.backgroundColorDark} !important`,
            },
            "&:active": {
                backgroundColor:
                    theme === "theme-light"
                        ? `${themeProperties.light.backgroundColorDark} !important`
                        : `${themeProperties.dark.backgroundColorDark} !important`,
            },
            fontSize: '14px',
            '& > span': {
                marginRight: 10,
                fontSize: 18,
            },
        },
    });
    const classes = useStylesAutoComplete();

    // This value is in country code - eg. DE, IN, US
    const { defaultValue } = props;

    const [value, setValue] = React.useState(defaultValue);

    const setSpecies = (name: string, value: any) => {
        setValue(name, value, {
            shouldValidate: true,
        });
        setspeciesSuggestion([]);
    };

    // This value is an object with keys - code, label and phone
    // This has to be passed to the component as default value
    // const [value, setValue] = React.useState();

    // // use default country passed to create default object & set contact details
    React.useEffect(() => {
        // create default object
        const defaultSpecies = speciesSuggestion.filter((data) => data.id === defaultValue);
        if (defaultSpecies && defaultSpecies.length > 0) {
            // set initial value
            setValue(defaultSpecies[0]);
            // set contact details
            props.onChange(defaultSpecies[0].id);
        }
    }, []);

    // Set contact details everytime value changes
    // React.useEffect(() => {
    //     if (value) {
    //         onChange(value.id);
    //     }
    // }, [value]);

    speciesSuggestion.sort((a, b) => {
        const nameA = `${a.name}`
        const nameB = `${b.name}`
        if (nameA > nameB) {
            return 1;
        } if (nameA < nameB) {
            return -1;
        }
        return 0;
    });

    return value && (
        <Autocomplete
            id="species-select"
            style={{ width: '100%' }}
            options={speciesSuggestion as SpeciesType[]}
            classes={{
                option: classes.option,
                paper: classes.paper,
            }}
            value={value}
            autoHighlight
            getOptionLabel={(option) => `${option.name}`}
            renderOption={(option) => (
                <>
                    <span>{option.scientificName}</span>
                </>
            )}
            onChange={(event: any, newValue: SpeciesType | null) => {
                if (newValue) {
                    setValue(newValue);
                }
            }}
            defaultValue={value.scientificName}
            renderInput={(params) => (
                <MaterialTextField
                    {...params}
                    label={props.label}
                    variant="outlined"
                    inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password', // disable autocomplete and autofill
                    }}
                    name={'scientificSpecies'}
                />
            )}
        />
    );
}

interface SpeciesType {
    id: string;
    name: string;
    scientificName: string;
}
