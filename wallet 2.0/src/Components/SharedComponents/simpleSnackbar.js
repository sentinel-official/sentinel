import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';
import lang from './../../Constants/language';


const styles1 = theme => ({
    margin: {
        marginBottom: '65px',
    }
});

class PositionedSnackbar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            vertical: 'bottom',
            horizontal: 'center',
        };
    }
    
    render() {
        const { vertical, horizontal } = this.state;
        const { classes, language } = this.props
        return (
            <div>
                <Snackbar
                    anchorOrigin={{ vertical, horizontal }}
                    open={this.props.open}
                    onClose={this.props.close}
                    classes={{
                        anchorOriginBottomCenter: classes.margin
                    }}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{this.props.message} {this.props.url?<span onClick={this.props.checkStatus} style={{cursor:'pointer'}}>{lang[language].CheckStatus}</span>:''}</span>}
                />
            </div>
        );
    }
}

export default withStyles(styles1)(PositionedSnackbar);