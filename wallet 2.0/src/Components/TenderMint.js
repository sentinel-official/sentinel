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


    render() {
        let { component, account, keys } = this.props;
        let { value } = this.state;
        switch (component) {
            case 'dashboard':
                {
                    return (
                        <div style={sidebarStyles.heightFull}>
                            <TMAccountView />
                        </div>
                    )
                }
                break;

            default: {
                return (
                    <div style={sidebarStyles.heightFull}>
                        {
                            account ?
                                <TMAccountDetails isPopup={false} />
                                :
                                <CreateTMAccount isPopup={false} />
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