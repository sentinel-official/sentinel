import React, { Component } from 'react';
import { homePageStyles } from '../Assets/authenticate.styles';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { sendError, setComponent } from '../Actions/authentication.action';
import { setCurrentTab } from '../Actions/sidebar.action';
import Toolbar from '@material-ui/core/Toolbar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '@material-ui/core/Button';
import { screenStyles } from '../Assets/selectScreen.styles';
import { setTestNet, setWalletType, setTendermint } from '../Actions/header.action';
import { readFile, KEYSTORE_FILE } from '../Utils/Keystore';
let lang = require('../Constants/language');

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openSnack: false,
            snackMessage: ''
        }
    }

    clickedEth = () => {
        readFile(KEYSTORE_FILE, (err) => {
            setTimeout(() => {
                if (err) this.props.setComponent('create');
                else this.props.setComponent('authenticate');
            }, 1000);
        })
    }

    clickedTm = () => {
        let currentTab = this.props.currentTab;
        this.props.setTestNet(true);
        this.props.setWalletType('TM');
        this.props.setTendermint(true);
        if (this.props.tmAccountDetails)
            this.props.setCurrentTab(currentTab);
        else
            this.props.setCurrentTab('receive');
        this.props.setComponent('dashboard');
    }

    // componentDidCatch(error, info) {
    //     sendError(error);
    // }

    render() {
        let language = this.props.language;
        return (<div>
            <Toolbar style={homePageStyles.toolbar}>\
                            <img src={'../src/Images/logo.svg'} alt="Logo" style={homePageStyles.toolbarImage} />
            </Toolbar>
            <div style={homePageStyles.middleDiv} >
                <Grid style={homePageStyles.middleDivGrid}>
                    <br />
                    <Row>
                        <Col>
                            <h2>{lang[language].AnonymousVPN}</h2>
                        </Col>
                        <p style={homePageStyles.middleDivText}>{lang[language].OpenSource}</p>
                        <br /><br />
                    </Row>
                </Grid>
                <div style={homePageStyles.wholeDiv}>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => { this.clickedEth() }}
                        style={homePageStyles.ethButtonStyle}>
                        {lang[language].ETHNetwork}<span>&nbsp;&nbsp;&gt;&gt; </span>
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => { this.clickedTm() }}
                        style={homePageStyles.tmButtonStyle}>
                        <span>&lt;&lt;&nbsp;&nbsp;</span>{lang[language].TMNetwork}
                    </Button>
                </div>
            </div>
            <Grid >
                <Row style={homePageStyles.m_l_20}>
                    <Col xs={7} style={homePageStyles.bottomDivCol}>
                        <div style={homePageStyles.m_l_p_5}>
                            <h4 style={homePageStyles.moreAboutText}>{lang[language].SentinelAnonymity}</h4>
                            <p style={{ fontSize: 14 }}>{lang[language].PeerToPeerMarket}</p>
                        </div>
                    </Col>
                    <Col xs={4} style={homePageStyles.m_l_5}>
                        <h4 style={homePageStyles.bottomDivBuilt}>{lang[language].BetaVersion}</h4>
                        <hr align="left" style={homePageStyles.underLine} />
                        <p style={homePageStyles.copyRight}>{lang[language].SentGroup}</p>
                    </Col>
                </Row>
            </Grid>
        </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        language: state.setLanguage,
        tmAccountDetails: state.setTMAccount,
        currentTab: state.setCurrentTab,
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        setComponent: setComponent,
        setTestNet,
        setTendermint,
        setWalletType,
        setCurrentTab,
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToActions)(Home);