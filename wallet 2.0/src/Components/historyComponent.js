import React from 'react';
import { historyLabel, historyValue } from '../Assets/commonStyles';
import { historyStyles } from '../Assets/txhistory.styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import lang from '../Constants/language';

class History extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let { date, to, from, gas, amount, status, tx, ownWallet, data, unit, language } = this.props;
        return (
            <div>
                <div>
                    <label style={to === ownWallet ? historyStyles.inStyle : historyStyles.outStyle}>{to === ownWallet ?
                        lang[language].In : lang[language].Out}&nbsp;
                            <span style={historyValue}>{new Date(parseInt(date) * 1000).toGMTString()}</span>
                    </label>
                </div>
                <div>
                    <label style={historyLabel} >{to === ownWallet ? `${lang[language].From}:` : `${lang[language].To}:`}&nbsp;
                            <span style={historyStyles.recepientStyle}>{to === ownWallet ? from : to}</span></label>
                    <label style={historyLabel}>{`${lang[language].GasPrice}:`}&nbsp;<span style={historyValue}>{gas}</span></label>
                </div>
                <div>
                    <label style={historyLabel}>{`${lang[language].Amount}:`}&nbsp;<span style={historyValue}>{amount} {unit}</span></label>
                    <label style={historyLabel}>{`${lang[language].Status}:`}&nbsp;<span style={historyLabel}>{status}</span></label>
                    <label style={historyLabel}>Tx:&nbsp;<span style={historyValue}>{tx}</span></label>

                </div>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {

    return bindActionCreators({}, dispatch)
};

const mapStateToProps = ({ setLanguage }) => {

    return { language: setLanguage }
};

export default connect(mapStateToProps, mapDispatchToProps)(History);