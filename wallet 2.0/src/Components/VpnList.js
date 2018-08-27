import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel } from '@material-ui/core'
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import { setListViewType, getVpnList, setVpnType } from '../Actions/vpnlist.action';
import CustomTextfield from "./customTextfield";
import VpnListView from './VpnListView';
import VpnMapView from './VpnMapView';
import CustomButton from "./customButton";
import { margin, radioStyle } from "../Assets/commonStyles";

const styles = theme => ({
    root: {
        display: 'flex',
    },
    networkFormControl: {
        margin: '10px 20px 0px 20px',
    },
    dVPNFormControl: {
        margin: '10px 20px 0px 20px',
    },
    group: {
        // margin: `${theme.spacing.unit}px 0`,
        flexDirection: 'row',
    },
});

class VpnList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isGetVPNCalled: false,
            dVpnQuery: '',
            vpnType: 'openvpn',
            networkType: 'public',
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ vpnType: nextProps.vpnType })
    }
    getVPNs = () => {
        this.props.getVpnList(this.props.vpnType);
    };

    componentWillMount = () => {
        this.props.getVpnList(this.state.vpnType);
    };

    handleRadioChange = (event) => {
        this.props.setVpnType(event.target.value);
        this.props.getVpnList(event.target.value);

    };
    handleNetworkChange = (event) => {
        // this.props.setVpnType(event.target.value);
        // this.props.getVpnList(event.target.value);

    };

    render() {
        const { classes } = this.props;
        // let self = this;
        // if (!this.state.isGetVPNCalled && this.props.isTest) {
        //     setInterval(function () {
        //         self.getVPNs()
        //     }, 10000);
        //     this.setState({ isGetVPNCalled: true });
        // }
        return (
            <div>
                <div style={{ display: 'flex' }} >
                    <div>
                        <CustomTextfield type={'text'} placeholder={"search for a dVPN node"}
                        onChange={ (e) => { this.setState({ dVpnQuery: e.target.value }) } }  />
                    </div>
                    <div style={margin}>
                        <CustomButton color={'#FFFFFF'} label={'LIST'} active={!this.state.isActive}
                            onClick={this.testSentHistory} />
                    </div>
                    <div style={margin}>
                        <CustomButton color={'#F2F2F2'} label={'MAP'} active={this.state.isActive}
                            onClick={this.testEthHistory} />
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }} >
                    <FormControl component="fieldset" className={classes.networkFormControl}>
                        {/*<FormLabel className={classes.row} component="legend">dVPN Type</FormLabel>*/}
                        <RadioGroup
                            aria-label="dVPN Type"
                            name="nodes"
                            className={classes.group}
                            value={this.state.networkType}
                            onChange={this.handleNetworkChange}
                        >
                            <FormControlLabel value="public" control={<Radio style={radioStyle} />} label="Public" />
                            <FormControlLabel value="private" control={<Radio style={radioStyle} />} label="Private" />
                        </RadioGroup>
                    </FormControl>
                    <FormControl component="fieldset" className={classes.dVPNFormControl}>
                        {/*<FormLabel className={classes.row} component="legend">dVPN Type</FormLabel>*/}
                        <RadioGroup
                            aria-label="dVPN Type"
                            name="nodes"
                            className={classes.group}
                            value={this.state.vpnType}
                            onChange={this.handleRadioChange}
                        >
                            <FormControlLabel value="openvpn" control={<Radio style={radioStyle} />} label="OpenVPN" />
                            <FormControlLabel value="socks5" control={<Radio style={radioStyle} />} label="SOCKS5" />
                        </RadioGroup>
                    </FormControl>

                </div>
                {
                    this.props.vpnList.length === 0 ?
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} ><CircularProgress size={50} /></div> :
                        this.props.listView === 'list' ?
                            <div style={{ maxWidth: 895, marginLeft: 20 }} >
                                <VpnListView query={this.state.dVpnQuery} />
                            </div>
                            :
                            <VpnMapView />
                }
            </div>
        )
    }
}

VpnList.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    return {
        lang: state.setLanguage,
        isTest: state.setTestNet,
        listView: state.setListViewType,
        vpnType: state.vpnType,
        vpnList: state.getVpnList
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        setListViewType,
        getVpnList,
        setVpnType
    }, dispatch)
}

export default compose(withStyles(styles), connect(mapStateToProps, mapDispatchToActions))(VpnList);