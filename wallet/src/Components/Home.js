import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Toolbar, ToolbarGroup, TextField, RaisedButton, List, ListItem } from 'material-ui';
import { checkKeystore } from '../Actions/AccountActions';

class Home extends Component {
    constructor(props) {
        super(props);
        this.set = this.props.set;
    }
    _goTo = () => {
        var that = this;
        checkKeystore(function (err) {
            if (err) that.set('create');
            else that.set('dashboard');
        })
    }
    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <Toolbar style={{ backgroundColor: 'rgb(83, 45, 145)' }}>
                        <ToolbarGroup>
                            <img src={'../src/Images/1.png'} style={styles.toolbarImage} />
                            <p style={{ color: 'white', marginLeft: 30, fontSize: 14, fontWeight: '600' }}>SENTINEL-ANON PLATFORM</p>
                        </ToolbarGroup>
                    </Toolbar>
                    <div style={{ backgroundImage: "url('../src/Images/hack1.jpg')", backgroundSize: 'cover', height: 420 }}>
                        <Grid style={{ padding: '7%', color: 'white' }}>
                            <Row>
                                <Col>
                                    <h1>Be as private as you wish, on internet!</h1>
                                </Col>
                                <p style={{ marginTop: 0, fontSize: 14 }}>Add a little bit of body text;Add a little bit of body text; </p>
                                <br /><br /><br />
                            </Row>
                        </Grid>
                        <RaisedButton
                            label="Yes I need this"
                            style={{ marginLeft: '7%' }}
                            labelStyle={{
                                textTransform: 'none', color: 'white', paddingRight: 25, paddingLeft: 25, fontWeight: '600'
                            }}
                            buttonStyle={{ backgroundColor: 'rgb(240, 94, 9)', height: '30px', lineHeight: '30px' }}
                            onClick={this._goTo.bind(this)}
                        />
                    </div>
                    <Grid >
                        <Row>
                            <Col xs={7} style={{ backgroundColor: 'rgb(83, 45, 145)', color: 'white', height: 196 }}>
                                <div style={{ marginLeft: '10%' }}>
                                    <h4 style={{ marginBottom: 10 }}>More About Sentinel</h4>
                                    <List>
                                        <ListItem primaryText="ABOUT US"
                                            innerDivStyle={{ padding: '5px 5px 5px 16px', fontSize: 12 }}
                                            style={{ color: 'white' }} />
                                        <ListItem primaryText="SERVICES"
                                            innerDivStyle={{ padding: '5px 5px 5px 16px', fontSize: 12 }}
                                            style={{ color: 'white' }} />
                                        <ListItem primaryText="WHITE PAPER"
                                            innerDivStyle={{ padding: '5px 5px 5px 16px', fontSize: 12 }}
                                            style={{ color: 'white' }} />
                                        <ListItem primaryText="PRIVACY POLICY"
                                            innerDivStyle={{ padding: '5px 5px 5px 16px', fontSize: 12 }} style={{ color: 'white' }} />
                                    </List>
                                </div>
                            </Col>
                            <Col xsOffset={1} xs={3}>
                                <h4 style={{ color: 'rgb(83, 45, 145)', fontWeight: 'bold', marginBottom: 0 }}>Built with care for user privacy</h4>
                                <pre style={{ marginTop: 0 }}><h2 style={{ textDecoration: 'underline', color: 'rgb(83, 45, 145)', marginTop: 0 }}>    </h2></pre>
                                <p style={{ fontWeight: '100', fontSize: 10, color: 'grey' }}>@Sentinel</p>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </MuiThemeProvider>
        )
    }
}

const styles = {
    toolbarImage:{
        width: 90, 
        height: 90, 
        paddingTop: '8%'
    }
}

export default Home;