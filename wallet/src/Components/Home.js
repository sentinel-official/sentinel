import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Toolbar, ToolbarGroup, RaisedButton } from 'material-ui';

class Home extends Component {
    constructor(props) {
        super(props);
        this.set = this.props.set;
    }

    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <Toolbar style={{ backgroundColor: '#2f3245', height: 70 }}>
                        <ToolbarGroup>
                            <img src={'../src/Images/logo.svg'} alt="Logo" style={styles.toolbarImage} />
                        </ToolbarGroup>
                    </Toolbar>
                    <div style={styles.middleDiv} >
                        <Grid style={styles.middleDivGrid}>
                            <br />
                            <Row>
                                <Col>
                                    <h2>Anonymous VPN backed by blockchain security</h2>
                                </Col>
                                <p style={styles.middleDivText}>Open-source wallet and secure service platform</p>
                                <br /><br />
                            </Row>
                        </Grid>
                        <RaisedButton
                            label="Create / Restore Wallet"
                            style={{ marginLeft: '7%', backgroundColor: 'transparent',height:'42px' }}
                            labelStyle={styles.yesButtonLabel}
                            buttonStyle={styles.yesButton}
                            onClick={() => { this.set('create') }}
                        />
                    </div>
                    <Grid >
                        <Row style={{ marginLeft: -20 }}>
                            <Col xs={7} style={styles.bottomDivCol}>
                                <div style={{ marginLeft: '5%', padding: '7%' }}>
                                    <h4 style={styles.moreAboutText}>Sentinel Anonymity Platform</h4>
                                    <p style={{ fontSize: 14 }}>
                                        Peer to peer erc based privacy application suite with multi chain
                                        for gas-free services and anonymous erc token transactions
                                        </p>
                                </div>
                            </Col>
                            <Col xs={4} style={{ marginLeft: '5%' }}>
                                <h4 style={styles.bottomDivBuilt}>Beta Version 0.1.2 with testnet</h4>
                                <hr align="left" style={styles.underLine} />
                                <p style={styles.copyRight}>SentinelGroup.io</p>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </MuiThemeProvider>
        )
    }
}

const styles = {
    toolbarImage: {
        width: 50,
        height: 50,
    },
    toolbarTitle: {
        color: 'white',
        marginLeft: 30,
        fontSize: 14,
        fontWeight: '600'
    },
    middleDiv: {
        backgroundImage: "url('../src/Images/BG.png')",
        backgroundSize: 'cover',
        height: 400
    },
    middleDivGrid: {
        padding: '7%',
        color: 'white'
    },
    middleDivText: {
        marginTop: 20,
        fontSize: '1.2rem'
    },
    yesButtonLabel: {
        color: 'white',
        paddingRight: 25,
        paddingLeft: 25,
        fontWeight: '600',
        fontSize: 16,
        height:42
    },
    yesButton: {
        backgroundColor: '#2f3245',
        borderRadius: '10px',
        height: '42px',
        lineHeight: '42px'
    },
    bottomDivCol: {
        backgroundColor: '#2f3245',
        color: 'white',
        height: 210
    },
    moreAboutText: {
        marginBottom: 30,
        fontSize: 16,
        fontWeight: 'bold'
    },
    bottomDivListItem: {
        padding: '5px 5px 5px 16px',
        fontSize: 12
    },
    bottomDivBuilt: {
        color: '#2f3245',
        marginBottom: 30,
        marginTop: '10%',
        fontSize: 16
    },
    underLine: {
        height: 3,
        borderWidth: 0,
        color: '#3a3e53',
        backgroundColor: '#3a3e53',
        width: '50%'
    },
    copyRight: {
        fontWeight: 'lighter',
        fontSize: 14,
        color: 'rgba(47, 50, 69, 0.68)',
        marginTop: 25
    }
}

export default Home;
