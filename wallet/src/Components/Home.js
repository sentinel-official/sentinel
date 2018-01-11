import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Toolbar, ToolbarGroup, TextField, RaisedButton, List, ListItem } from 'material-ui';

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
                            <img src={'../src/Images/1.png'} style={styles.toolbarImage} />
                            <p style={styles.toolbarTitle}>SENTINEL-ANON PLATFORM</p>
                        </ToolbarGroup>
                    </Toolbar>
                    <div style={styles.middleDiv} >
                        <Grid style={styles.middleDivGrid}>
                            <Row>
                                <Col>
                                    <h1>Be as private as you wish, on internet!</h1>
                                </Col>
                                <p style={styles.middleDivText}>Add a little bit of body text;Add a little bit of body text; </p>
                                <br /><br /><br />
                            </Row>
                        </Grid>
                        <RaisedButton
                            label="Yes I need this"
                            style={{ marginLeft: '7%' }}
                            labelStyle={styles.yesButtonLabel}
                            buttonStyle={styles.yesButton}
                            onClick={()=>{this.set('create')}}
                        />
                    </div>
                    <Grid >
                        <Row>
                            <Col xs={7} style={styles.bottomDivCol}>
                                <div style={{ marginLeft: '10%' }}>
                                    <h4 style={{ marginBottom: 10 }}>More About Sentinel</h4>
                                    <List>
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
                                    </List>
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
        width: 90,
        height: 90,
        paddingTop: '8%'
    },
    toolbarTitle: {
        color: 'white',
        marginLeft: 30,
        fontSize: 14,
        fontWeight: '600'
    },
    middleDiv: {
        backgroundImage: "url('../src/Images/hack1.jpg')",
        backgroundSize: 'cover',
        height: 420
    },
    middleDivGrid: {
        padding: '7%',
        color: 'white'
    },
    middleDivText: {
        marginTop: 0,
        fontSize: 14
    },
    yesButtonLabel: {
        textTransform: 'none',
        color: 'white',
        paddingRight: 25,
        paddingLeft: 25,
        fontWeight: '600'
    },
    yesButton: {
        backgroundColor: 'rgb(240, 94, 9)',
        height: '30px',
        lineHeight: '30px'
    },
    bottomDivCol: {
        backgroundColor: 'rgb(83, 45, 145)',
        color: 'white',
        height: 196
    },
    bottomDivListItem: {
        padding: '5px 5px 5px 16px',
        fontSize: 12
    },
    bottomDivBuilt: {
        color: 'rgb(83, 45, 145)',
        fontWeight: 'bold',
        marginBottom: 0
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