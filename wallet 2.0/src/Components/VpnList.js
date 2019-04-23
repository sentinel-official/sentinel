import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    CircularProgress, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel, IconButton, Snackbar,
    InputLabel, MenuItem, Select,Tooltip
} from '@material-ui/core';
import { connect } from 'react-redux';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import { networkChange } from '../Actions/NetworkChange';
import { setListViewType, getVpnList, setVpnType, setProtocolType } from '../Actions/vpnlist.action';
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
import { getWireguardDetails } from './../Actions/tendermint.action';

import '../Assets/footerStyle.css';


const electron = window.require('electron');
const remote = electron.remote;

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
            listLoading: true,
            walletType: 'ERC',

            network: "public",
            protocol: "all",
        }
    }

    getGatewayAddr = async (authCode) => {
        this.setState({ isLoading: true });
        getGatewayUrl(authCode, (err, data, url) => {
            // console.log("Pri...", err, data, url);
            if (err) {
                this.setState({ isPrivate: false,network :'public', openPopup: false, openSnack: true, snackMessage: lang[this.props.language].ProblemEnablingPrivateNet });
                setTimeout(() => { this.setState({ isLoading: false, }) }, 1500);

            }
            else {
                this.setState({ isPrivate: true, openPopup: false, openSnack: true, snackMessage: `${lang[this.props.language].PrivateNetEnabledWith}${url}` });
                this.props.networkChange('private');
                setTimeout(() => { this.setState({ isLoading: false, uri: true }) }, 1500);
                setTimeout(() => { this.getVPNs(); }, 500);
            }
        })
    };

    componentDidMount = () => {
        if (this.props && this.props.listView === "map") {
            this.setState({ listActive: false, mapActive: true , });
        }
        this.setState({protocol : this.props.protocolType}) // to list the nodes based on the previous nodeType
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ protocolType: nextProps.protocolType, walletType: nextProps.walletType });
        if (nextProps.walletType != this.state.walletType) {
            if (nextProps.isTM) {
                this.setState({ listLoading: true,  });
                this.props.getVpnList(nextProps.protocolType, nextProps.isTM)
                    .then((res) => {
                        this.setState({ listLoading: false })
                    })
            } else {
                this.setState({ listLoading: true })
                this.props.getVpnList(nextProps.protocolType, nextProps.isTM)
                    .then((res) => {
                        this.setState({ listLoading: false })
                    })
            }
        }
    }

    getVPNs = () => {
        this.setState({ listLoading: true });
        this.props.getVpnList(this.props.protocolType, this.props.isTM)
            .then((res) => {
                this.setState({ listLoading: false })
            })
    };

    componentWillMount = () => {
        // console.log("remote plotform ",remote.process.platform)
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


    // handleRadioChange = (event) => {
    //     this.props.setVpnType(event.target.value);
    //     console.log("wireguard listing ", event.target.value);
    //     // console.log("it is me " ,getWireguardDetails)
    //     if (event.target.value === 'wireguard') {
    //         getWireguardDetails();
    //     }
    //     else {
    //         this.setState({ listLoading: true });
    //         this.props.getVpnList(event.target.value, this.props.isTM)
    //             .then((res) => {
    //                 this.setState({ listLoading: false })
    //             })
    //     }

    // };

    handleRadioChange = (event) => {
        // this.props.setVpnType(event.target.value.toLocaleLowerCase());
        this.props.setProtocolType(event.target.value.toLocaleLowerCase());
        // console.log("wireguard listing ", event.target.value);
        // console.log("it is me " ,getWireguardDetails)

        this.setState({ listLoading: true , [event.target.name]: event.target.value});
        this.props.getVpnList(event.target.value, this.props.isTM)
            .then((res) => {
                this.setState({ listLoading: false })
            })

    };

   
    handleProtocolChange = event => {
        // this.props.setVpnType(event.target.value.toLocaleLowerCase());
        this.props.setProtocolType(event.target.value.toLocaleLowerCase());
        this.setState({ listLoading: true , [event.target.name]: event.target.value});
        this.props.getVpnList(event.target.value, this.props.isTM)
            .then((res) => {
                this.setState({ listLoading: false })
            })
    };


    handleNetworkChange = (event) => {
        if (isOnline()) {
            
            if (event.target.value === 'private') {
                checkGateway((err, data, url) => {
                    if (err) {
                        this.setState({ openPopup: true });
                    }
                    else {
                        this.setState({ authcode: data, isPrivate: true,network:'private', openSnack: true, openPopup: false, snackMessage: 'Private Net is Enabled with ' + url })
                        this.props.networkChange('private');
                        setTimeout(() => { this.getVPNs(); }, 500);
                    }
                })
            }
            else {
                setMaster((data) => {
                    this.setState({ isPrivate: false,network : 'public', authcode: '', openPopup: false })
                    this.props.networkChange('public');
                    setTimeout(() => { this.getVPNs(); }, 500);
                })
            }
        }
        else {
            this.setState({ openSnack: true, snackMessage: lang[this.props.language].Offline })
        }
    }

    closePrivDialog = () => {
        this.setState({ openPopup: false, network:'public' });
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

    handleClose = (event, reason) => {
        this.setState({ openSnack: false });
    };

    render() {
        const { classes, isTM, language } = this.props;
        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }} >
                    <div>
                        {
                            this.state.mapActive ?
                            <div>
                                <FormControl component="fieldset" className={classes.networkFormControl}>
                                    {/* <RadioGroup
                                        aria-label="dVPN Type"
                                        name="nodes"
                                        className={classes.group}
                                        value={this.props.networkType}
                                        onChange={this.handleNetworkChange}
                                    >
                                        <FormControlLabel value="public" control={<Radio style={radioStyle} />} label={lang[this.props.language].Public} />
                                        <FormControlLabel value="private" control={<Radio disabled={isTM} style={radioStyle} />} label={isTM ? lang[this.props.language].PrivateComingSoon : lang[this.props.language].Private} />
                                    </RadioGroup> */}

                                    <InputLabel htmlFor="age-simple" >
                                    {lang[this.props.language].NodeNetworkLabel}
                                    </InputLabel>
                                    <Select
                                        value={this.state.network}
                                        onChange={this.handleNetworkChange}
                                        // disabled={this.props.vpnStatus}
                                        className="dpn_value"
                                        inputProps={{
                                            name: "network"
                                        }}
                                    >
                                        <MenuItem className="dpn_value" value="public">{lang[this.props.language].Public}</MenuItem>
                                        <MenuItem className="dpn_value" value="private" disabled={isTM}>{isTM ? lang[this.props.language].PrivateComingSoon : lang[this.props.language].Private}</MenuItem>
                                    </Select>

                                </FormControl>

                                <FormControl component="fieldset" className={classes.dVPNFormControl}>
                                {/* <RadioGroup
                                    aria-label="dVPN Type"
                                    name="nodes"
                                    className={classes.group}
                                    value={this.state.vpnType}
                                    onChange={this.handleRadioChange}
                                >
                                    <FormControlLabel value="openvpn" control={<Radio style={radioStyle} />} label={lang[this.props.language].OpenVPN} />
                                    <FormControlLabel value="socks5" control={<Radio style={radioStyle} disabled={isTM} />} label={ isTM ? lang[this.props.language].Socks5ComingSoon : lang[this.props.language].Socks5} />
                                { isTM ? 
                                    <FormControlLabel value="wireguard" control={<Radio style={radioStyle}
                                    disabled = {remote.process.platform === 'linux' ? false : true} />} label="WireGuard" />
                                    : ''
                                }
                                </RadioGroup> */}

                                <InputLabel htmlFor="age-simple" >
                                {lang[this.props.language].Protocol}
                                </InputLabel>
                                {/* <Tooltip title={this.props.vpnStatus ? lang[language].CannotChooseVPN : ''}> */}
                                <Select
                                    value={this.state.protocol}
                                    className="dpn_value"
                                    // disabled={this.props.vpnStatus}
                                    onChange={this.handleProtocolChange}
                                    inputProps={{
                                        name: "protocol"
                                    }}
                                >
                                     <MenuItem className="dpn_value" value="all">{lang[this.props.language].AllOption}</MenuItem>
                                    <MenuItem className="dpn_value" value="openvpn">{lang[this.props.language].OpenVPN}</MenuItem>
                                    {isTM && remote.process.platform === 'linux' ?
                                    <MenuItem className="dpn_value" value="wireguard">{lang[this.props.language].WireGuard}</MenuItem> : ""}
                                    <MenuItem className="dpn_value" value="socks5"  disabled={isTM}>{ isTM ? lang[this.props.language].Socks5ComingSoon : lang[this.props.language].Socks5}</MenuItem>
                                 </Select>
                                {/* </Tooltip> */}
                                </FormControl>
                                </div>

                                :
                                <div style={{ marginLeft: 20 }}>
                                    <CustomTextfield type={'text'} placeholder={lang[language].SearchdVPNnode} disabled={false}
                                        value={this.state.dVpnQuery}
                                        multi={false}
                                        onChange={(e) => {
                                            this.setState({ dVpnQuery: e.target.value })
                                        }} />
                                </div>
                        }
                        <NetworkChangeDialog open={this.state.openPopup}
                            close={this.closePrivDialog} getGatewayAddr={this.getGatewayAddr}
                            isLoading={this.state.isLoading} language={language}
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
                            <div>
                            <FormControl component="fieldset" className={classes.networkFormControl}>
                                {/* <RadioGroup
                                    aria-label="dVPN Type"
                                    name="nodes"
                                    className={classes.group}
                                    value={this.props.networkType}
                                    onChange={this.handleNetworkChange}
                                >
                                    <FormControlLabel value="public" control={<Radio style={radioStyle} />} label={lang[this.props.language].Public} />
                                    <FormControlLabel value="private" control={<Radio style={radioStyle} disabled={isTM} />}
                                        label={isTM ? lang[this.props.language].PrivateComingSoon : lang[this.props.language].Private} />
                                </RadioGroup> */}

                                <InputLabel htmlFor="age-simple">
                                {lang[this.props.language].NodeNetworkLabel}
                                </InputLabel>
                                <Select
                                    value={this.state.network}
                                    onChange={this.handleNetworkChange}
                                    className="dpn_value"
                                    // disabled={this.props.vpnStatus}
                                    inputProps={{
                                        name: "network"
                                    }}
                                >
                                    <MenuItem className="dpn_value" value="public">{lang[this.props.language].Public}</MenuItem>
                                    <MenuItem className="dpn_value" value="private" disabled={isTM}>{isTM ? lang[this.props.language].PrivateComingSoon : lang[this.props.language].Private}</MenuItem>
                                </Select>

                            </FormControl>
                            <FormControl component="fieldset" className={classes.dVPNFormControl}>
                                                  
                                <InputLabel htmlFor="age-simple" >
                                {lang[this.props.language].Protocol}

                         </InputLabel>
                         {/* <Tooltip title={this.props.vpnStatus ? lang[language].CannotChooseVPN : ''}> */}
                            <Select
                                value={this.state.protocol}
                                onChange={this.handleProtocolChange}
                                className="dpn_value"
                                // disabled={this.props.vpnStatus}
                                inputProps={{
                                    name: "protocol"
                                }}
                            >
                               <MenuItem className="dpn_value" value="all">{lang[this.props.language].AllOption}</MenuItem>
                                    <MenuItem className="dpn_value" value="openvpn">{lang[this.props.language].OpenVPN}</MenuItem>
                                    {isTM && remote.process.platform === 'linux' ?
                                    <MenuItem className="dpn_value" value="wireguard">{lang[this.props.language].WireGuard}</MenuItem> : ""}
                                    <MenuItem className="dpn_value" value="socks5"  disabled={isTM}>{ isTM ? lang[this.props.language].Socks5ComingSoon : lang[this.props.language].Socks5}</MenuItem>
                                 </Select>
                            {/* </Tooltip> */}
                        </FormControl>
                        </div>
                    }
                    

                    <IconButton onClick={() => { this.getVPNs() }} style={{ marginTop: 15, marginRight: 10, outline: 'none' }}>
                        <RefreshIcon />
                    </IconButton>

                </div>
                {
                    !this.props.vpnList ?
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} ><CircularProgress size={50} /></div>
                        :
                        this.props.listView === 'list' ?
                            <div style={{ maxWidth: 895, marginLeft: 20 }} >
                                <VpnListView query={this.state.dVpnQuery} loading={this.state.listLoading} />
                            </div>
                            :
                            <VpnMapView zoom={this.state.zoom} />
                }
                <Snackbar
                    open={this.state.openSnack}
                    autoHideDuration={4000}
                    onClose={this.handleClose}
                    message={this.state.snackMessage}
                />
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
        vpnStatus: state.setVpnStatus,
        vpnList: state.getVpnList,
        isTM: state.setTendermint,
        networkType: state.networkChange,
        walletType: state.getWalletType,
        wireguardData: state.getWireguardDetails,
        protocolType: state.protocolType,
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        setListViewType,
        getVpnList,
        setVpnType,
        setProtocolType,
        networkChange,
    }, dispatch)
}

export default compose(withStyles(styles), connect(mapStateToProps, mapDispatchToActions))(VpnList);