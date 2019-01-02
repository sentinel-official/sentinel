import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, IconButton  } from '@material-ui/core'
import RefreshIcon from '@material-ui/icons/Refresh'
import { bindActionCreators } from 'redux';
import { testSENTTxns, testETHTxns } from '../Actions/getHistoryAction'
import { label, buttonStyle, disabledButton } from '../Assets/commonStyles'
import History from "../Components/historyComponent";
import CustomButton from '../Components/customButton'

class TxnHistory extends Component {

    constructor(props){
        super(props);

        this.state = {
            isActive: false,
        }
    }

    testSentHistory = () => {

        this.setState({ isActive: false });
        let data = {
            account_addr: this.props.getAccount,
            isTest: this.props.setTestNet
        };
      this.props.testSENTTxns(data)
        // .then(res => { console.log('res', res) })
        // .catch(err => { console.log('err', err) });

    };

    testEthHistory = () => {
        this.setState({ isActive: true });

        let data = {
            account_addr: this.props.getAccount,
            isTest: this.props.setTestNet
        };
        this.props.testETHTxns(data)
            // .then(res => { console.log('res', res) })
            // .catch(err => { console.log('err', err) });
    };

    render() {
        let ethTxns;
        let sentTxns;

        if (this.props.testETHHistory) {
            ethTxns = this.props.testETHHistory.data.result.map(data => {
                // console.log(data, 'see this');
                return (
                    <div style={{ marginTop: 20, marginBottom: 20 }}>
                        <History ownWallet={this.props.getAccount} date={new Date().toISOString()} to={data.to}
                                 gas={data.gas} from={data.from} amount={data.value} status={'success'} tx={data.hash} />
                    </div>
                )
        })
        }

        if (this.props.testSENTHistory) {
            sentTxns = this.props.testSENTHistory.data.result.map(data => {
                return (
                    <div style={{ marginTop: 20, marginBottom: 20 }}>
                        <History ownWallet={this.props.getAccount} date={new Date().toISOString()} to={data.to}
                                 from={data.to} gas={data.gas} amount={data.value} status={'success'} tx={data.hash} />
                    </div>
                )
            })
        }
        return (
            <div style={{ margin: 10 }} >
                <div style={{ display: 'flex', justifyContent: 'space-between' }} >
                    <div>
                        <label style={label} >{ !this.state.isActive ? "SENT" : "ETH"} Transactions</label>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <div style={ styles.margin }>
                            <IconButton style={{ outline: 'none' }} aria-label="Refresh">
                                <RefreshIcon style={{ outline: 'none' }}/>
                            </IconButton>
                        </div>
                        <div style={ styles.margin }>
                            <CustomButton color={'#FFFFFF'}  label={'SENT'} active={!this.state.isActive}
                                          onClick={this.testSentHistory} />
                        </div>
                        <div style={ styles.margin }>
                            <CustomButton color={'#F2F2F2'} label={'ETH'} active={this.state.isActive}
                                          onClick={this.testEthHistory}/>
                        </div>
                    </div>
                </div>
                <div style={styles.historyContainer} >
                    {
                        this.props.testETHHistory && this.props.testETHHistory.data.result.length > 0 ?
                            !this.state.isActive ? sentTxns : ethTxns : <div style={styles.noTxYet}>No Transactions yet</div>
                    }
                    {/*<History data = {this.props.testETHHistory && this.props.testETHHistory.data.result.length > 0 ? this.props.testETHHistory.data.result : [] }  />*/}
                </div>
            </div>
        )
    }
}


const styles = {
    margin: {
        marginLeft: 10,
        marginRight: 10,
    },
    historyContainer: {
        overflowY: 'auto',
        height: 450,
        flexDirection: 'column',
        paddingTop: 200,
        paddingLeft:'45px',
        marginTop: 20,
        display: 'flex',
        justifyContent: 'center',
    },
    noTxYet:{
        marginTop:'-600px'
    }
};

const mapDispatchToProps = (dispatch) => {

    return bindActionCreators({ testSENTTxns, testETHTxns }, dispatch)
};

const mapStateToProps = ( { testSENTHistory, testETHHistory, getAccount, setTestNet } ) => {

    return { testSENTHistory, testETHHistory, getAccount, setTestNet }
};

export default connect(mapStateToProps, mapDispatchToProps)(TxnHistory);