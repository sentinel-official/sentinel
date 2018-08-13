import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { List, ListItem, ListItemText, Divider } from '@material-ui/core';
import lang from '../Constants/language';
import Flag from 'react-world-flags';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { listStyles } from '../Assets/vpnListView.styles';
let Country = window.require('countrynames');

class VpnListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        let language = this.props.lang;
        let vpnsList = this.props.availableVpns;
        return (
            <div>
                {
                    vpnsList.length !== 0 ?
                        <List>
                            <Row style={listStyles.listHeadingStyle}>
                                <Col xs={1}>
                                    <p>{lang[language].Flag}</p>
                                </Col>
                                <Col xs={3}>
                                    <p>{lang[language].VpnAddress}</p>
                                </Col>
                                <Col xs={2}>
                                    <p>{lang[language].Bandwidth}</p>
                                </Col>
                                <Col xs={2}>
                                    <p>{lang[language].Latency}</p>
                                </Col>
                                <Col xs={2}>
                                    <p>Algorithm</p>
                                </Col>
                                <Col xs={2}>
                                    <p>{lang[language].Price}</p>
                                </Col>
                            </Row>
                            <div style={listStyles.viewStyle}>
                                {vpnsList.map((vpn, index) =>
                                    <span >
                                        <ListItem button key={index}>
                                            <ListItemText primary={
                                                <Row>
                                                    <Col xs={1}>
                                                        <Flag code={Country.getCode(vpn.location.country)} height="16" />
                                                    </Col>
                                                    <Col xs={3}>
                                                        <p style={listStyles.fieldValueStyle}>{vpn.location.city}, {vpn.location.country}</p>
                                                    </Col>
                                                    <Col xs={2}>
                                                        <p style={listStyles.fieldValueStyle}>{(vpn.net_speed.download / (1024 * 1024)).toFixed(2)} Mbps</p>
                                                    </Col>
                                                    <Col xs={2}>
                                                        <p style={listStyles.fieldValueStyle}>{vpn.latency ? vpn.latency : 'None'}
                                                            {vpn.latency ? (vpn.latency === 'Loading...' ? null : ' ms') : null}</p>
                                                    </Col>
                                                    <Col xs={2}>
                                                        <p style={listStyles.algoTextStyle}>{vpn.enc_method ? vpn.enc_method : 'None'}</p>
                                                    </Col>
                                                    <Col xs={2}>
                                                        <p style={listStyles.fieldValueStyle}>{vpn.price_per_GB ? vpn.price_per_GB : 100}</p>
                                                    </Col>
                                                </Row>
                                            }
                                            />
                                        </ListItem>
                                        <Divider />
                                    </span>
                                )}
                            </div>
                        </List>
                        :
                        <div></div>
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        lang: state.setLanguage,
        availableVpns: state.getVpnList
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToActions)(VpnListView);