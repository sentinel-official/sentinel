import React  from 'react';
import { historyLabel, historyValue } from '../Assets/commonStyles'

History = ({ date, to, from, gas, amount, status, tx, ownWallet, data }) => {
    console.log('data: ', data);
        return (
                <div>
                    <div>
                        <label style={ to === ownWallet ? styles.inStyle : styles.outStyle}>{ to === ownWallet ? 'IN' : 'OUT' }&nbsp;
                            <span style={historyValue}>{new Date(parseInt(date) * 1000).toGMTString()}</span>
                        </label>
                    </div>
                    <div>
                        <label style={historyLabel} >{ to === ownWallet ? 'From:' : 'To:'}&nbsp;
                            <span style={styles.recepientStyle}>{ to === ownWallet ? from : to}</span></label>
                        <label style={historyLabel}>Gas Price:&nbsp;<span style={historyValue}>{gas} GWEI</span></label>
                    </div>
                    <div>
                        <label style={historyLabel}>Amount:&nbsp;<span style={historyValue}>{amount / Math.pow(10,9) }</span></label>
                        <label style={historyLabel}>Status:&nbsp;<span style={historyValue}>{status}</span></label>
                        <label style={historyLabel}>Tx:&nbsp;<span style={historyValue}>{tx}</span></label>

                    </div>
                </div>
        )
};

const styles = {
    outStyle: {
        color: 'red',
        fontFamily: 'Montserrat, Medium',
        fontSize: 15,
        marginRight: 10,
        fontWeight: '700'
    },
    inStyle: {
        color: 'green',
        fontFamily: 'Montserrat, Medium',
        fontSize: 15,
        marginRight: 10,
        fontWeight: '700'
    },
    recepientStyle: {
        color: '#318EDE',
        fontFamily: 'Montserrat, Regular',
        fontWeight: 'normal',
        fontSize: 13
    }
};

export default History;