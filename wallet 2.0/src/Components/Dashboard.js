import React, { Component } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { getAccount } from '../Actions/dashboard.action';
import { dashboardStyles } from '../Assets/dashboard.styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#2196f3'
        }
    }
});

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scene: null,
            lang: 'en'
        }
    }

    componentWillMount = () => {
        this.props.getAccount();
    }
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <div>
                    <Header />
                    <div style={dashboardStyles.layoutStyle}>
                        <div style={dashboardStyles.sideBarStyle}>
                            <Sidebar />
                        </div>
                        <div style={dashboardStyles.componentStyle}>

                        </div>
                    </div>
                    <Footer />
                </div>
            </MuiThemeProvider>
        )
    }
}

function mapStateToProps(state) {
    return {
        walletAddress: state.getAccount
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        getAccount
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToActions)(Dashboard);