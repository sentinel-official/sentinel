import React from 'react';
import { historyLabel, historyValue } from '../Assets/commonStyles';
import { historyStyles } from '../Assets/txhistory.styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import lang from '../Constants/language';
import { getTxInfo } from '../Actions/tendermint.action'
import { Card, CardContent, IconButton, Snackbar, Tooltip } from '@material-ui/core';
import { sessionStyles } from '../Assets/tmsessions.styles';



class TMTransactionsHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fetchedAPI: false
        }
    }

    componentDidMount() {
        this.props.getTxInfo();
    }

    render() {
        return (
            <div>
                {
                    this.state.fetchedAPI ?
                        <Card>
                            <CardContent style={sessionStyles.cardtext}>
                                <div>
                                    <label style={historyStyles.outStyle}>OUT&nbsp;
                            {/* <span style={historyValue}>{new Date(parseInt(date) * 1000).toGMTString()}</span> */}
                                    </label>
                                </div>
                                <div>
                                    <label style={historyLabel} >FROM&nbsp;
                            <span style={historyStyles.recepientStyle}>cosmosaccaddr1dwyt6xrltp6n6v4fhtqwatqp4l6k4ufs088qmx</span></label>
                                    <label style={historyLabel} >TO&nbsp;
                            <span style={historyStyles.recepientStyle}>cosmosaccaddr1dwyt6xrltp6n6v4fhtqwatqp4l6k4ufs088qmx</span></label>
                                    <label style={historyLabel}>{`Gas Price`}&nbsp;<span style={historyValue}>34534</span></label>
                                </div>
                                <div>
                                    <label style={historyLabel}>{`Amount:`}&nbsp;<span style={historyValue}>100 SUT</span></label>
                                    <label style={historyLabel}>{`Status:`}&nbsp;<span style={historyLabel}>SUCCESS</span></label>
                                    <label style={historyLabel}>Tx:&nbsp;<span style={historyValue}>FB6B84054025E03E808B115F644F1D3AF6083A5E</span></label>
                                </div>
                            </CardContent>
                        </Card>
                        :
                        <Card style={{ margin: 30 }} >
                            <CardContent style={sessionStyles.cardtext}>
                                <center><p>  Will be updated soon. </p></center>
                            </CardContent>
                        </Card>
                }
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {

    return bindActionCreators({
        getTxInfo
    }, dispatch)
};

const mapStateToProps = ({ setLanguage }) => {

    return { language: setLanguage }
};

export default connect(mapStateToProps, mapDispatchToProps)(TMTransactionsHistory);