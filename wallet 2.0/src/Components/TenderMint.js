import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Paper, Tabs, Tab } from '@material-ui/core';
import { sidebarStyles } from '../Assets/sidebar.styles';
import { getKeys, setTMComponent, getTendermintAccount, setTMAccount } from '../Actions/tendermint.action';
import { payVPNTM } from '../Actions/vpnlist.action';
import CreateTMAccount from './CreateTMAccount';
import TMAccountDetails from './TMAccountDetails';
import TMAccountView from './TMAccountView';
import TMTransfer from './TMTransfer'
import TMTransactionsHistory from './TMTransactionsHistory'
import TMSessions from './TMSessions';

class TenderMint extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0
        }
    }

    // handleChange = (event, value) => {
    //     this.setState({ value });
    //     this.props.payVPNTM({ 'isPayment': false })
    // };

    // componentWillMount = () => {
    //     this.props.getKeys().then(res => {
    //         if (res.payload.length !== 0) {
    //             getTendermintAccount((name) => {
    //                 if (name) {
    //                     let mainAccount = res.payload.find(obj => obj.name === name)
    //                     if (mainAccount) {
    //                         this.props.setTMAccount(mainAccount);
    //                         this.props.setTMComponent('dashboard');
    //                     }
    //                     else {
    //                         console.log("Account...", mainAccount, name)
    //                         this.props.setTMComponent('home');
    //                     }
    //                 }
    //                 else {
    //                     console.log("No Account in TMConfig..", name)
    //                     this.props.setTMComponent('home');
    //                 }
    //             });
    //         }
    //         else {
    //             console.log("No Keys")
    //             this.props.setTMComponent('home');
    //         }
    //     });
    // }

    // componentWillReceiveProps = (nextProps) => {
    //     if (nextProps.vpnPayment.isPayment) {
    //         this.setState({ value: 1 })
    //     }
    // }

    render() {
        let { component, account, keys } = this.props;
        let { value } = this.state;
        switch (component) {
            case 'dashboard':
                {
                    return (
                        <div style={sidebarStyles.heightFull}>
                            <TMAccountView />
                            {/* <Paper>
                                <Tabs
                                    value={value}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    onChange={this.handleChange}
                                >
                                    <Tab label="Account" style={sidebarStyles.outlineNone} />
                                    <Tab label="Transfer" style={sidebarStyles.outlineNone} />
                                    <Tab label="Sessions" style={sidebarStyles.outlineNone} />
                                    <Tab label="Transactions History" style={sidebarStyles.outlineNone} />
                                </Tabs>
                            </Paper>
                            {value === 0 && <TMAccountView />}
                            {value === 1 && <TMTransfer />}
                            {value === 2 && <TMSessions />}
                            {value === 3 && <TMTransactionsHistory />} */}
                        </div>
                    )
                }
                break;

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
        account: state.createTMAccount,
        vpnPayment: state.payVPNTM
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        getKeys,
        setTMComponent,
        payVPNTM,
        setTMAccount
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToActions)(TenderMint);