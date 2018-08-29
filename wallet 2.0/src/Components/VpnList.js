import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel, IconButton } from '@material-ui/core'
import { connect } from 'react-redux';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import { setListViewType, getVpnList, setVpnType } from '../Actions/vpnlist.action';
import CustomTextfield from "./customTextfield";
import VpnListView from './VpnListView';
import VpnMapView from './VpnMapView';
import RefreshIcon from '@material-ui/icons/Refresh';
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
            zoom: 1,
            isGetVPNCalled: false,
            dVpnQuery: '',
            vpnType: 'openvpn',
            networkType: 'public',
            listActive: true,
            mapActive: false,
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ vpnType: nextProps.vpnType })
    }
    getVPNs = () => {
        this.props.getVpnList(this.props.vpnType, this.props.isTM);
    };

    componentWillMount = () => {
        this.props.getVpnList(this.state.vpnType, this.props.isTM);
    };

    handleRadioChange = (event) => {
        this.props.setVpnType(event.target.value);
        this.props.getVpnList(event.target.value, this.props.isTM);

    };
    handleNetworkChange = (event) => {
        // this.props.setVpnType(event.target.value);
        // this.props.getVpnList(event.target.value);

    };

    listViewActive = () => {
        this.setState({ listActive: true, mapActive: false });
        this.props.setListViewType('list')
    };

    mapViewActive = () => {
        this.setState({ listActive: false, mapActive: true});
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
                <div style={{ display: 'flex', justifyContent: 'space-between' }} >
                    <div>
                        {
                            this.state.mapActive ?

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
                                :
                            <CustomTextfield type={'text'} placeholder={"search for a dVPN node"} disabled={false}
                                             value={this.state.dVpnQuery} onChange={(e) => {
                                this.setState({dVpnQuery: e.target.value})
                            }}/>
                        }
                    </div>
                    <div style={{ display: 'flex' }} >
                        <div style={margin}>
                            <CustomButton color={'#FFFFFF'} label={'LIST'} active={this.state.listActive}
                                          onClick={this.listViewActive} />
                        </div>
                        <div style={margin}>
                            <CustomButton color={'#F2F2F2'} label={'MAP'} active={this.state.mapActive}
                                          onClick={this.mapViewActive} />
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }} >
                    {
                        this.state.mapActive ?
                            <div>
                                <IconButton onClick={ this.handleZoomIn } style={{ marginTop: 15, outline: 'none' }}>
                                    <ZoomInIcon/>
                                </IconButton>
                                <IconButton onClick={ this.handleZoomOut } style={{ marginTop: 15, outline: 'none' }}>
                                    <ZoomOutIcon/>
                                </IconButton>
                            </div> :
                        <FormControl component="fieldset" className={classes.networkFormControl}>
                            {/*<FormLabel className={classes.row} component="legend">dVPN Type</FormLabel>*/}
                            <RadioGroup
                                aria-label="dVPN Type"
                                name="nodes"
                                className={classes.group}
                                value={this.state.networkType}
                                onChange={this.handleNetworkChange}
                            >
                                <FormControlLabel value="public" control={<Radio style={radioStyle}/>} label="Public"/>
                                <FormControlLabel value="private" control={<Radio style={radioStyle}/>}
                                                  label="Private"/>
                            </RadioGroup>
                        </FormControl>
                    }
                    <IconButton onClick={() => { this.getVPNs() }} style={{ marginTop: 15, outline: 'none' }}>
                        <RefreshIcon />
                    </IconButton>
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
        lang: state.setLanguage,
        isTest: state.setTestNet,
        listView: state.setListViewType,
        vpnType: state.vpnType,
        vpnList: state.getVpnList,
        isTM: state.setTendermint
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