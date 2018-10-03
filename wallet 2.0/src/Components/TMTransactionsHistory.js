import React from 'react';
import { historyLabel, historyValue, label } from '../Assets/commonStyles';
import { historyStyles } from '../Assets/txhistory.styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import lang from '../Constants/language';
import _ from 'lodash';
import History from "../Components/historyComponent";
import RefreshIcon from '@material-ui/icons/Refresh';
import { getTransactions } from '../Actions/tendermint.action'
import { Card, CardContent, IconButton, Snackbar, Tooltip } from '@material-ui/core';
import { sessionStyles } from '../Assets/tmsessions.styles';

class TMTransactionsHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fetchedAPI: true,
            txData: [],
            loading: true
        }
    }

    componentWillMount = () => {
        this.getTxData();
    }

    getTxData = () => {
        this.setState({ loading: true })
        getTransactions(this.props.account.address, (data) => {
            this.setState({ txData: data, loading: false })
        });
    }

    render() {
        let output;
        let transactions = _.sortBy(this.state.txData, obj => obj.timestamp).reverse();
        if (this.state.loading) {
            output = <div style={sessionStyles.noSessionsStyle}>Loading...</div>
        }
        else {
            if (transactions && transactions.length > 0) {
                output = transactions.map(data => {
                    if (data) {
                        return (
                            <div style={historyStyles.data}>
                                <History ownWallet={this.props.account.address} date={parseInt(Date.parse(data.timestamp) / 1000)}
                                    to={data.to?data.to:'Paid to chain'} gas={data.gas} from={data.from} unit={'SUTs'}
                                    amount={parseInt(data.amount) / (10 ** 8)} status={'Success'} tx={data.hash} />
                            </div>
                        )
                    } else {
                        return null
                    }
                })
            }
            else {
                output = <div style={sessionStyles.noSessionsStyle}>No Transactions yet</div>
            }
        }
        return (
            <div style={sessionStyles.firstDiv}>
                <h2 style={sessionStyles.header}>{'Transactions'}</h2>
                <IconButton
                    aria-label="Refresh"
                    onClick={this.getTxData}
                    style={sessionStyles.buttonRefresh}>
                    <RefreshIcon />
                </IconButton>
                <div style={historyStyles.tmHistoryCont}>
                    {output}
                </div>
            </div >
        )
    }
}

const mapDispatchToProps = (dispatch) => {

    return bindActionCreators({
    }, dispatch)
};

const mapStateToProps = ({ setLanguage, setTMAccount }) => {

    return { language: setLanguage, account: setTMAccount }
};

export default connect(mapStateToProps, mapDispatchToProps)(TMTransactionsHistory);