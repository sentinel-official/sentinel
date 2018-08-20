import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Paper, Tabs, Tab } from '@material-ui/core';
import { sidebarStyles } from '../Assets/sidebar.styles';
import { getKeys, setTMComponent } from '../Actions/tendermint.action';
import CreateTMAccount from './CreateTMAccount';
import TMAccountDetails from './TMAccountDetails';

class TenderMint extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0
        }
    }

    handleChange = (event, value) => {
        this.setState({ value });
    };

    componentWillMount = () => {
        this.props.getKeys().then(res => {
            if (res.payload.length !== 0) {
                this.props.setTMComponent('dashboard');
            }
            else {
                this.props.setTMComponent('home');
            }
        });
    }

    render() {
        let { component, account, keys } = this.props;
        switch (component) {
            case 'dashboard':
                {
                    return (
                        <div style={sidebarStyles.heightFull}>
                            <Paper>
                                <Tabs
                                    value={this.state.value}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    onChange={this.handleChange}
                                >
                                    <Tab label="Account" style={sidebarStyles.outlineNone} />
                                    <Tab label="Transactions" style={sidebarStyles.outlineNone} />
                                </Tabs>
                            </Paper>
                        </div>
                    )
                }

            default: {
                return (
                    <div style={sidebarStyles.heightFull}>
                        {
                            account ?
                                <TMAccountDetails />
                                :
                                <CreateTMAccount />
                        }
                    </div>
                )
            }
        }
    }
}

function mapStateToProps(state) {
    return {
        lang: state.setLanguage,
        isTest: state.setTestNet,
        keys: state.getKeys,
        component: state.setTMComponent,
        account: state.createTMAccount
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        getKeys,
        setTMComponent
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToActions)(TenderMint);