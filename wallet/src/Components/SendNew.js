import React, { Component } from 'react';
import { MuiThemeProvider, Snackbar, DropDownMenu, MenuItem, RaisedButton, TextField } from 'material-ui';
import { Grid, Row, Col } from 'react-flexbox-grid';

class SendNew extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <MuiThemeProvider>
                <Grid>
                    <Row>
                        <Col xs={5} style={{ padding: '3% 3%' }}>
                            <p style={{ fontSize: 16, fontWeight: 600, color: '#253245', letterSpacing: 2 }}>TOKEN BALANCE</p>
                            <div style={{ padding: '4%', paddingBottom: 0, backgroundColor: '#ececf1' }}>
                                <Row>
                                    <Col xs={5}>
                                        <img src={'../src/Images/logo.svg'} alt="logo" style={{ width: 50, height: 50, margin: '1% 20%' }} />
                                    </Col>
                                    <Col xs={7}>
                                        <p style={{ fontSize: 18, fontWeight: 'bold', letterSpacing: 3 }}>17245.152</p>
                                        <p style={{ color: 'grey', marginTop: -18, letterSpacing: 2 }}>Sentinel [SENT]</p>
                                    </Col>
                                </Row>
                            </div>
                            <div style={styles.otherBalanceDiv}>
                                <Row>
                                    <Col xs={5}>
                                        <img src={'../src/Images/logo.svg'} alt="logo" style={styles.otherBalanceLogo} />
                                    </Col>
                                    <Col xs={7}>
                                        <p style={styles.otherBalanceBalc}>0.23198126</p>
                                        <p style={styles.otherBalanceText}>Ethereum [ETH]</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={5}>
                                        <img src={'../src/Images/logo.svg'} alt="logo" style={styles.otherBalanceLogo} />
                                    </Col>
                                    <Col xs={7}>
                                        <p style={styles.otherBalanceBalc}>24.4896</p>
                                        <p style={styles.otherBalanceText}>OmiseGO [OMG]</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={5}>
                                        <img src={'../src/Images/logo.svg'} alt="logo" style={styles.otherBalanceLogo} />
                                    </Col>
                                    <Col xs={7}>
                                        <p style={styles.otherBalanceBalc}>191.58</p>
                                        <p style={styles.otherBalanceText}>0x [ZRX]</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={5}>
                                        <img src={'../src/Images/logo.svg'} alt="logo" style={styles.otherBalanceLogo} />
                                    </Col>
                                    <Col xs={7}>
                                        <p style={styles.otherBalanceBalc}>0</p>
                                        <p style={styles.otherBalanceText}>Golem [GNT]</p>
                                    </Col>
                                </Row>
                            </div>
                            <RaisedButton
                                label="Convert ERC20 to SENT"
                                labelStyle={{ textTransform: 'none', color: 'white', fontWeight: 'bold', height: 42 }}
                                fullWidth={true}
                                buttonStyle={{ backgroundColor: '#595d8f', height: 42, lineHeight: '42px' }}
                            />
                        </Col>
                        <Col xs={7} style={{ padding: '3% 5%' }}>
                            <div>
                                <span style={styles.formHeading}>SEND TO ADDRESS</span>
                                <span data-tip data-for="toField" style={styles.questionMark}>?</span>
                                <TextField
                                    hintText="Example: 0x6b6df9e25f7bf23343mfkr45"
                                    hintStyle={{ bottom: 8, paddingLeft: 10, letterSpacing: 2 }}
                                    style={{ backgroundColor: '#d4dae2', height: 42, marginTop: 15 }}
                                    underlineShow={false} fullWidth={true}
                                    inputStyle={{ padding: 10 }}
                                />
                            </div>
                            <div style={{ marginTop: '5%' }}>
                                <span style={styles.formHeading}>AMOUNT TO SEND</span>
                                <span data-tip data-for="toField" style={styles.questionMark}>?</span>
                                <Row>
                                    <Col xs={8}>
                                        <TextField
                                            type="number"
                                            underlineShow={false} fullWidth={true}
                                            inputStyle={{ padding: 10 }}
                                            style={{ backgroundColor: '#d4dae2', height: 42, marginTop: 12 }}
                                            underlineShow={false} fullWidth={true}
                                        />
                                    </Col>
                                    <Col xs={4}>
                                        <DropDownMenu
                                            autoWidth={false}
                                            iconStyle={{
                                                top: -12,
                                                right: 0
                                            }}
                                            labelStyle={{
                                                height: 42,
                                                lineHeight: '42px',
                                                fontWeight: '600',
                                                color: '#2f3245',
                                                textAlign: 'center',
                                                paddingLeft: 0,
                                                paddingRight: 24
                                            }}
                                            style={{
                                                backgroundColor: '#b6b9cb',
                                                height: 42,
                                                width: '110%',
                                                marginTop: 12,
                                                marginLeft: -16
                                            }}
                                            value="SENT"
                                            menuItemStyle={{ width: 160 }}
                                        >
                                            <MenuItem
                                                value="ETH"
                                                primaryText="TEST ETH"
                                            />
                                            <MenuItem
                                                value="SENT"
                                                primaryText="TEST SENT"
                                            />
                                        </DropDownMenu>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Grid>
            </MuiThemeProvider>
        )
    }
}

const styles = {
    otherBalanceLogo: {
        width: 40,
        height: 40,
        margin: '1% 23%'
    },
    otherBalanceBalc: {
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 3
    },
    otherBalanceText: {
        color: 'grey',
        fontSize: 14,
        marginTop: -15,
        letterSpacing: 2
    },
    otherBalanceDiv: {
        padding: '4%',
        paddingBottom: 0,
        backgroundColor: '#ececf1',
        marginTop: '3%'
    },
    questionMark: {
        marginLeft: 10,
        fontSize: 13,
        borderRadius: '50%',
        backgroundColor: '#2f3245',
        paddingLeft: 6,
        paddingRight: 6,
        color: 'white'
    },
    formHeading: {
        fontSize: 16,
        fontWeight: 600,
        color: '#253245',
        letterSpacing: 2
    }
}

export default SendNew;