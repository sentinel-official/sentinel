import React from 'react';
import { historyLabel, historyValue } from '../Assets/commonStyles';
import { historyStyles } from '../Assets/txhistory.styles';

History = ({ date, to, from, gas, amount, status, tx, ownWallet, data }) => {
    return (
        <div>
            <div>
                <label style={to === ownWallet ? historyStyles.inStyle : historyStyles.outStyle}>{to === ownWallet ? 'IN' : 'OUT'}&nbsp;
                            <span style={historyValue}>{new Date(parseInt(date) * 1000).toGMTString()}</span>
                </label>
            </div>
            <div>
                <label style={historyLabel} >{to === ownWallet ? 'From:' : 'To:'}&nbsp;
                            <span style={historyStyles.recepientStyle}>{to === ownWallet ? from : to}</span></label>
                <label style={historyLabel}>Gas Price:&nbsp;<span style={historyValue}>{gas} GWEI</span></label>
            </div>
            <div>
                <label style={historyLabel}>Amount:&nbsp;<span style={historyValue}>{amount}</span></label>
                <label style={historyLabel}>Status:&nbsp;<span style={historyValue}>{status}</span></label>
                <label style={historyLabel}>Tx:&nbsp;<span style={historyValue}>{tx}</span></label>

            </div>
        </div>
    )
};

export default History;