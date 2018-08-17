import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getVPNUsageData } from '../Utils/utils'
import { footerStyles } from '../Assets/footer.styles';
import { Grid, Row, Col } from 'react-flexbox-grid';
import lang from '../Constants/language';

class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        let language = this.props.lang;
        return (
            <div style={footerStyles.mainDivStyle}>
                <Grid>
                    <Row>
                        <Col xs={3} style={footerStyles.firstColumn}>
                            <p style={footerStyles.testLabelStyle}>
                                {this.props.isTest ? 'Test Net Activated' : 'Test Net NOT Activated'}
                            </p>
                        </Col>
                        <Col xsOffset={2} xs={7}>
                            <Row style={footerStyles.textCenter}>
                                <Col xs={3}>
                                    <label style={footerStyles.headingStyle}>IP Address</label>
                                    <label style={footerStyles.valueStyle}>192.158.12.34</label>
                                </Col>
                                <Col xs={2}>
                                    <label style={footerStyles.headingStyle}>{lang[language].Speed}</label>
                                    <label style={footerStyles.valueStyle}>290 Mbps</label>
                                </Col>
                                <Col xs={3}>
                                    <label style={footerStyles.headingStyle}>{lang[language].Location}</label>
                                    <label style={footerStyles.valueStyle}>Singapore</label>
                                </Col>
                                <Col xs={2}>
                                    <label style={footerStyles.headingStyle}>Download</label>
                                    <label style={footerStyles.valueStyle}>123.1 Mb</label>
                                </Col>
                                <Col xs={2}>
                                    <label style={footerStyles.headingStyle}>Upload</label>
                                    <label style={footerStyles.valueStyle}>23.1 Mb</label>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Grid>
            </div>
        )
    }
}

function mapStateToProps(state, { VPNUsage }) {
    return {
        lang: state.setLanguage,
        isTest: state.setTestNet,
        VPNUsage,
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToActions)(Footer);