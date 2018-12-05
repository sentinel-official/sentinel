import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: 15,
        marginLeft: 20,
    },
    bootstrapRoot: {
        padding: 0,
        'label + &': {
            marginTop: theme.spacing.unit * 3,
        },
    },
    bootstrapInput: {
        borderRadius: 1,    //changed from 4
        backgroundColor: theme.palette.common.white,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 12px', //changed from 10px 12px
        width: '600px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
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
            // borderColor: '#80bdff',
            // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
    bootstrapFormLabel: {
        fontSize: 18,
    },
});

const theme = createMuiTheme({
    palette: {
        primary: green,
    },
});

const CustomTextfield = ({ classes, onChange, placeholder, type, disabled, value }) => {
    return (
        <div className={classes.container}>
            <TextField
                onChange={onChange}
                type={type}
                disabled={disabled}
                placeholder={placeholder}
                id="bootstrap-input"
                value={value}
                inputProps={type === 'number' ? {
                    min: 0
                } : {}}
                InputProps={{
                    disableUnderline: true,
                    classes: {
                        root: classes.bootstrapRoot,
                        input: classes.bootstrapInput,
                    },
                }}
                InputLabelProps={{
                    shrink: true,
                    className: classes.bootstrapFormLabel,
                }}
            />
        </div>
    );
};

CustomTextfield.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CustomTextfield);