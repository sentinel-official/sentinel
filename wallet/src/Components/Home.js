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
                    <Toolbar style={{ backgroundColor: 'rgb(83, 45, 145)' }}>
                        <ToolbarGroup>
                            <img src={'../src/Images/3.png'} alt="Logo" style={styles.toolbarImage} />
                            <p style={styles.toolbarTitle}>SENTINEL-ANON PLATFORM</p>
                        </ToolbarGroup>
                    </Toolbar>
                    <div style={styles.middleDiv} >
                        <Grid style={styles.middleDivGrid}>
                            <br />
                            <Row>
                                <Col>
                                    <h2>VPN backed by blockChain security and anonymity.</h2>
                                </Col>
                                <p style={styles.middleDivText}></p>
                                <br /><br /><br />
                            </Row>
                        </Grid>
                        <RaisedButton
                            label="Create Wallet"
                            style={{ marginLeft: '7%',backgroundColor:'transparent' }}
                            labelStyle={styles.yesButtonLabel}
                            buttonStyle={styles.yesButton}
                            onClick={() => { this.set('create') }}
                        />
                    </div>
                    <Grid >
                        <Row style={{ marginLeft: -20 }}>
                            <Col xs={7} style={styles.bottomDivCol}>
                                <div style={{ marginLeft: '5%', padding: '2%' }}>
                                    <h4 style={styles.moreAboutText}>More About Sentinel</h4>
                                    <p style={{ fontSize: 12 }}>
                                        Peer to peer erc based privacy application suite with multi chain
                                        for gas-free services and anonymous erc token transactions
                                        </p>
                                    {/* <List>
                                        <ListItem primaryText="ABOUT US"
                                            innerDivStyle={styles.bottomDivListItem}
                                            style={{ color: 'white' }} />
                                        <ListItem primaryText="SERVICES"
                                            innerDivStyle={styles.bottomDivListItem}
                                            style={{ color: 'white' }} />
                                        <ListItem primaryText="WHITE PAPER"
                                            innerDivStyle={styles.bottomDivListItem}
                                            style={{ color: 'white' }} />
                                        <ListItem primaryText="PRIVACY POLICY"
                                            innerDivStyle={styles.bottomDivListItem}
                                            style={{ color: 'white' }} />
                                    </List> */}
                                </div>
                            </Col>
                            <Col xsOffset={1} xs={3}>
                                <h4 style={styles.bottomDivBuilt}>Built with care for user privacy</h4>
                                <pre style={{ marginTop: 0 }}><h2 style={styles.underLine}>    </h2></pre>
                                <p style={styles.copyRight}>@Sentinel</p>
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
        width: 80,
        height: 100,
        paddingTop: '8%'
    },
    toolbarTitle: {
        color: 'white',
        marginLeft: 30,
        fontSize: 14,
        fontWeight: '600'
    },
    middleDiv: {
        backgroundImage: "url('../src/Images/back.png')",
        backgroundSize: 'cover',
        height: 420
    },
    middleDivGrid: {
        padding: '7%',
        color: 'white'
    },
    middleDivText: {
        marginTop: 20,
        fontSize: 16
    },
    yesButtonLabel: {
        color: 'white',
        paddingRight: 25,
        paddingLeft: 25,
        fontWeight: '600'
    },
    yesButton: {
        backgroundColor: '#12a5df',
        borderRadius:'10px'
        // height: '30px',
        // lineHeight: '30px'
    },
    bottomDivCol: {
        backgroundColor: 'rgb(83, 45, 145)',
        color: 'white',
        height: 196
    },
    moreAboutText: {
        marginBottom: 10,
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: '8%'
    },
    bottomDivListItem: {
        padding: '5px 5px 5px 16px',
        fontSize: 12
    },
    bottomDivBuilt: {
        color: 'rgb(83, 45, 145)',
        fontWeight: 'bold',
        marginBottom: 0,
        marginTop: '15%',
        fontSize: 18
    },
    underLine: {
        textDecoration: 'underline',
        color: 'rgb(83, 45, 145)',
        marginTop: 0
    },
    copyRight: {
        fontWeight: '100',
        fontSize: 10,
        color: 'grey'
    }
}

export default Home;
