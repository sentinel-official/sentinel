import React, { Component } from 'react';
import { homePageStyles } from './../Assets/authenticate.styles';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { sendError, setComponent } from '../Actions/authentication.action';
import Toolbar from '@material-ui/core/Toolbar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '@material-ui/core/Button';
let lang = require('./../Constants/language');

class Home extends Component {
    componentDidCatch(error, info) {
        sendError(error);
    }

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
                <Button variant="contained"
                    style={homePageStyles.raisedButton}
                    labelStyle={homePageStyles.yesButtonLabel}
                    buttonStyle={homePageStyles.yesButton}
                    onClick={() => { this.props.setComponent('create') }}
                >{lang[language].CreateRestore}</Button>
            </div>
            <Grid >
                <Row style={homePageStyles.m_l_20}>
                    <Col xs={7} style={homePageStyles.bottomDivCol}>
                        <div style={homePageStyles.m_l_p_5}>
                            <h4 style={homePageStyles.moreAboutText}>{lang[language].SentinelAnonymity}</h4>
                            <p style={{ fontSize: 14 }}>{lang[language].PeerToPeer}</p>
                        </div>
                    </Col>
                    <Col xs={4} style={homePageStyles.m_l_5}>
                        <h4 style={homePageStyles.bottomDivBuilt}>{lang[language].BetaVersion}</h4>
                        <hr align="left" style={homePageStyles.underLine} />
                        <p style={homePageStyles.copyRight}>SentinelGroup.io</p>
                    </Col>
                </Row>
            </Grid>
        </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        language: state.setLanguage
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        setComponent: setComponent
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToActions)(Home);