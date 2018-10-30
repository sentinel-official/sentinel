import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel, IconButton } from '@material-ui/core'
import { connect } from 'react-redux';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import { networkChange } from '../Actions/NetworkChange';
import { setListViewType, getVpnList, setVpnType } from '../Actions/vpnlist.action';
import CustomTextfield from "./customTextfield";
import VpnListView from './VpnListView';
import VpnMapView from './VpnMapView';
import RefreshIcon from '@material-ui/icons/Refresh';
import CustomButton from "./customButton";
import { margin, radioStyle } from "../Assets/commonStyles";
import { isOnline } from "../Actions/convertErc.action";
import { checkGateway, getGatewayUrl, isPrivate, setMaster, getMasterUrl } from "../Utils/utils";
import { isVPNConnected } from '../Utils/VpnConfig';
import NetworkChangeDialog from "./SharedComponents/networkChangeDialog";
import lang from '../Constants/language';

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
            zoom: 1,
            isGetVPNCalled: false,
            listActive: true,
            mapActive: false,
            isTest: false,
            openSnack: false,
            isPrivate: false,
            isLoading: false,
            openPopup: false,
            uri: false,
            snackMessage: '',
            authCode: '',
            vpnType: 'openvpn',
            networkType: 'public',
            dVpnQuery: '',

        }
    }

    getGatewayAddr = async (authCode) => {
        this.setState({ isLoading: true });
        getGatewayUrl(authCode, (err, data, url) => {
            if (err) {
                this.setState({ isPrivate: false, openPopup: false, openSnack: true, snackMessage: err.message || 'Problem in enabling private net' });
                setTimeout(() => { this.setState({ isLoading: false, }) }, 1500);
                setTimeout(() => { this.getVPNs(); }, 500);
            }
            else {
                this.setState({ isPrivate: true, openPopup: false, openSnack: true, snackMessage: 'Private Net is Enabled with ' + url });
                this.props.networkChange('private');
                setTimeout(() => { this.setState({ isLoading: false, uri: true }) }, 1500);
                setTimeout(() => { this.getVPNs(); }, 500);
            }
        })
    };


    componentWillReceiveProps(nextProps) {
        this.setState({ vpnType: nextProps.vpnType })
    }
    getVPNs = () => {
        this.props.getVpnList(this.props.vpnType, this.props.isTM);
    };

    componentWillMount = () => {
        isVPNConnected((err, data) => {
            if (err) {
                getMasterUrl();
                setTimeout(() => { this.getVPNs(); }, 500);
            }
            else if (data) {
                isPrivate(async (isPrivate, authcode) => {
                    if (isPrivate) {
                        await this.props.networkChange('private');
                        this.setState({ isPrivate, authcode, openPopup: false });
                        setTimeout(() => { this.getVPNs(); }, 500);
                    }
                    else {
                        localStorage.setItem('networkType', 'public');
                        setTimeout(() => { this.getVPNs(); }, 500);
                    }
                })
            }
        })
    };

    handleRadioChange = (event) => {
        this.props.setVpnType(event.target.value);
        this.props.getVpnList(event.target.value, this.props.isTM);

    };
    handleNetworkChange = (event) => {
        if (isOnline()) {
            if (event.target.value === 'private') {
                checkGateway((err, data, url) => {
                    if (err) {
                        this.setState({ openPopup: true });
                    }
                    else {
                        this.setState({ authcode: data, isPrivate: true, openSnack: true, openPopup: false, snackMessage: 'Private Net is Enabled with ' + url })
                        this.props.networkChange('private');
                        setTimeout(() => { this.getVPNs(); }, 500);
                    }
                })
            }
            else {
                setMaster((data) => {
                    this.setState({ isPrivate: false, authcode: '', openPopup: false })
                    this.props.networkChange('public');
                    setTimeout(() => { this.getVPNs(); }, 500);
                })
            }
        }
        else {
            this.setState({ openSnack: true, snackMessage: 'You Are Offline' })
        }
    }

    closePrivDialog = () => {
        this.setState({ openPopup: false });
    };
    listViewActive = () => {
        this.setState({ listActive: true, mapActive: false });
        this.props.setListViewType('list')
    };

    mapViewActive = () => {
        this.setState({ listActive: false, mapActive: true });
        this.props.setListViewType('map')

    };

    handleZoomIn = () => {
        this.setState({
            zoom: this.state.zoom * 2,
        })
    };

    handleZoomOut = () => {
        this.setState({
            zoom: this.state.zoom / 2,
        })
    };

    render() {
        const { classes, isTM, language } = this.props;

        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }} >
                    <div>
                        {
                            this.state.mapActive ?

                                <FormControl component="fieldset" className={classes.networkFormControl}>
                                    <RadioGroup
                                        aria-label="dVPN Type"
                                        name="nodes"
                                        className={classes.group}
                                        value={this.props.networkType}
                                        onChange={this.handleNetworkChange}
                                    >
                                        <FormControlLabel value="public" control={<Radio style={radioStyle} />} label="Public" />
                                        <FormControlLabel value="private" control={<Radio disabled={isTM} style={radioStyle} />} label="Private" />
                                    </RadioGroup>
                                </FormControl>
                                :
                                <CustomTextfield type={'text'} placeholder={"search for a dVPN node"} disabled={false}
                                    value={this.state.dVpnQuery} onChange={(e) => {
                                        this.setState({ dVpnQuery: e.target.value })
                                    }} />
                        }
                        <NetworkChangeDialog open={this.state.openPopup}
                            close={this.closePrivDialog} getGatewayAddr={this.getGatewayAddr}
                            isLoading={this.state.isLoading}
                            uri={this.state.uri} snackbar={this.state.snackMessage}
                        />
                    </div>
                    <div style={{ display: 'flex' }} >
                        <div style={margin}>
                            <CustomButton color={'#FFFFFF'} label={lang[language].List} active={this.state.mapActive}
                                onClick={this.listViewActive} />
                        </div>
                        <div style={margin}>
                            <CustomButton color={'#F2F2F2'} label={lang[language].Map} active={this.state.listActive}
                                onClick={this.mapViewActive} />
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }} >
                    {
                        this.state.mapActive ?
                            <div>
                                <IconButton onClick={this.handleZoomIn} style={{ marginTop: 15, outline: 'none' }}>
                                    <ZoomInIcon />
                                </IconButton>
                                <IconButton onClick={this.handleZoomOut} style={{ marginTop: 15, outline: 'none' }}>
                                    <ZoomOutIcon />
                                </IconButton>
                            </div> :
                            <FormControl component="fieldset" className={classes.networkFormControl}>
                                {/*<FormLabel className={classes.row} component="legend">dVPN Type</FormLabel>*/}
                                <RadioGroup
                                    aria-label="dVPN Type"
                                    name="nodes"
                                    className={classes.group}
                                    value={this.props.networkType}
                                    onChange={this.handleNetworkChange}
                                >
                                    <FormControlLabel value="public" control={<Radio style={radioStyle} />} label="Public" />
                                    <FormControlLabel value="private" control={<Radio style={radioStyle} disabled={isTM} />}
                                        label="Private" />
                                </RadioGroup>
                            </FormControl>
                    }
                    {/* <IconButton onClick={() => { this.getVPNs() }} style={{ marginTop: 15, outline: 'none' }}>
                        <RefreshIcon />
                    </IconButton> */}
                    <FormControl component="fieldset" className={classes.dVPNFormControl}>
                        <RadioGroup
                            aria-label="dVPN Type"
                            name="nodes"
                            className={classes.group}
                            value={this.state.vpnType}
                            onChange={this.handleRadioChange}
                        >
                            <FormControlLabel value="openvpn" control={<Radio style={radioStyle} />} label="OpenVPN" />
                            <FormControlLabel value="socks5" control={<Radio style={radioStyle} disabled={isTM} />} label="SOCKS5" />
                        </RadioGroup>
                    </FormControl>

                     <IconButton onClick={() => { this.getVPNs() }} style={{ marginTop: 15,marginRight:10, outline: 'none' }}>
                        <RefreshIcon />
                    </IconButton>

                </div>
                {
                    !this.props.vpnList ?
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} ><CircularProgress size={50} /></div> :
                        this.props.listView === 'list' ?
                            <div style={{ maxWidth: 895, marginLeft: 20 }} >
                                <VpnListView query={this.state.dVpnQuery} />
                            </div>
                            :
                            <VpnMapView zoom={this.state.zoom} />
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
        language: state.setLanguage,
        isTest: state.setTestNet,
        listView: state.setListViewType,
        vpnType: state.vpnType,
        vpnList: state.getVpnList,
        isTM: state.setTendermint,
        networkType: state.networkChange,
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        setListViewType,
        getVpnList,
        setVpnType,
        networkChange,
    }, dispatch)
}

export default compose(withStyles(styles), connect(mapStateToProps, mapDispatchToActions))(VpnList);