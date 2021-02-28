import { createStyles, InputBase, Theme, withStyles } from '@material-ui/core';
import React, { ReactElement } from 'react'

interface Props {

}
const BootstrapInput = withStyles((theme: Theme) =>
    createStyles({
        root: {
            'label + &': {
                marginTop: theme.spacing(3),
            },
        },
        input: {
            borderRadius: 9,
            position: 'relative',
            backgroundColor: theme.palette.background.paper,
            boxShadow: '0px 3px 6px #00000029',
            fontSize: 14,
            padding: '10px 26px 10px 12px',
            transition: theme.transitions.create(['border-color', 'box-shadow']),
            // Use the system font instead of the default Roboto font.
            fontFamily: [
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
            ].join(','),
            '&:focus': {
                backgroundColor: theme.palette.background.paper,
                borderRadius: 9,
                // borderColor: '#80bdff',
                // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
            },
        },
    })
)(InputBase);

export default BootstrapInput;