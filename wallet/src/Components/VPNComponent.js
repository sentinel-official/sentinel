import React, { Component } from 'react';
import { getVPNList, connectVPN, getVPNUsageData, isOnline, getLatency, disconnectVPN, getVpnHistory } from '../Actions/AccountActions';
import ZoomIn from 'material-ui/svg-icons/content/add';
import { Grid, Row, Col } from 'react-flexbox-grid';
import CopyToClipboard from 'react-copy-to-clipboard';
import _ from 'lodash';
import ZoomOut from 'material-ui/svg-icons/content/remove';
import Up from 'material-ui/svg-icons/navigation/arrow-drop-up';
import Down from 'material-ui/svg-icons/navigation/arrow-drop-down';
import { IconButton, RaisedButton, List, ListItem, Divider, Dialog, FlatButton, Snackbar, TextField } from "material-ui";
import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography,
    Markers,
    Marker
} from 'react-simple-maps';
import { sendError } from '../helpers/ErrorLog';
import clear from 'material-ui/svg-icons/content/clear';
import Flag from 'react-world-flags';
import ReactTooltip from 'react-tooltip';
let Country = window.require('countrynames');
var markers = []
let lang = require('./language');
var UsageInterval = null;

class VPNComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            zoom: 1,
            isGetVPNCalled: false,
            isUsageCalled: false,
            usage: null,
            vpnList: [],
            mapActive: false,
            activeVpn: null,
            showPopUp: false,
            showPay: false,
            openSnack: false,
            snackMessage: '',
            statusSnack: false,
            statusMessage: '',
            status: false,
            showInstruct: false,
            isMac: false,
            showPay: false,
            payAccount: '',
            markersList: [],
            vpnUpdatedList: [],
            searchText: '',
            sortUp: true,
            sortType: 'vpn',
            selectedVPN: null,
            dueAmount: 0,
            dueSession: null
        }
        this.handleZoomIn = this.handleZoomIn.bind(this)
        this.handleZoomOut = this.handleZoomOut.bind(this)
    }

    handleZoomIn() {
        this.setState({
            zoom: this.state.zoom * 2,
        })
    }

    handleZoomOut() {
        this.setState({
            zoom: this.state.zoom / 2,
        })
    }
    handleClick(marker, evt) {
        this.setState({ activeVpn: marker.vpn, showPopUp: true })
    }
    componentWillMount = () => {
        this.getVPNs()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.status === false)
            this.setState({ status: nextProps.status, selectedVPN: null });
        else
            this.setState({ status: nextProps.status, selectedVPN: nextProps.vpnData.vpn_addr });
    }

    getDueAmount() {
        let self = this;
        getVpnHistory(this.props.local_address, (err, history) => {
            if (err) {
                console.log("Error in getting due...")
            }
            else {
                let dueSession = history.sessions.find((obj) => { return obj.is_paid === false; })
                self.setState({ dueAmount: history.due, dueSession: dueSession });
            }
        })

    }

    payDue = () => {
        this.props.vpnPayment(this.state.dueSession);
    }

    getVPNs() {
        let self = this;
        getVPNList(function (err, data) {
            if (err) sendError(err);
            else {
                markers = []
                data.map((vpn, i) => {
                    var vpnServer = {
                        name: vpn.location.city,
                        vpn: vpn,
                        coordinates: [vpn.location.longitude, vpn.location.latitude]
                    }
                    if (localStorage.getItem(vpn.account_addr) === null) {
                        vpn.latency = parseFloat(self._loadLatency(vpn));
                    }
                    else {
                        vpn.latency = parseFloat(localStorage.getItem(vpn.account_addr));
                    }
                    markers.push(vpnServer);
                })
                self.setState({ vpnList: _.sortBy(data, o => o.location.city), markersList: markers })
                if (self.state.searchText === '') {
                    self.setState({ vpnUpdatedList: _.sortBy(data, o => o.location.city) })
                    if (self.state.sortUp) {
                        self.upSort()
                    }
                    else {
                        self.downSort()
                    }
                }
            }
        })
    }

    _loadLatency(vpn) {
        let self = this;
        getLatency(vpn.ip, function (err, latency) {
            if (err) return null;
            else {
                localStorage.setItem(vpn.account_addr, latency);
                return latency
            }
        })
    }

    _connectVPN = () => {
        if (this.state.status) {
            this.setState({ showPopUp: false, openSnack: true, snackMessage: 'You are already connected to one VPN. Disconnect it and try again.' })
        }
        else {
            this.props.changeTest(true);
            this.setState({ showPopUp: false, statusSnack: true, statusMessage: 'Connecting...' })
            let that = this;
            if (isOnline()) {
                connectVPN(this.props.local_address, this.state.activeVpn.account_addr, function (err, isMacError, isWinError, account, message) {
                    if (isMacError) {
                        that.setState({ status: false, showInstruct: true, statusSnack: false, isMac: true })
                    }
                    else if (isWinError) {
                        that.setState({ status: false, showInstruct: true, statusSnack: false, isMac: false })
                    }
                    else if (account) {
                        that.setState({ status: false, showPay: true, statusSnack: false, isMac: false, payAccount: account })
                    }
                    else if (err) {
                        if (err.message !== true)
                            that.setState({ status: false, statusSnack: false, showInstruct: false, openSnack: true, snackMessage: err.message })
                    }
                    else {
                        that.props.onChange();
                        //that.returnVPN();
                        that.setState({ selectedVPN: that.state.activeVpn.account_addr, status: true, statusSnack: false, showInstruct: false, openSnack: true, snackMessage: `${lang[that.props.lang].ConnectedVPN}. ${message}` })
                    }
                })
            }
            else {
                this.setState({ openSnack: true, statusSnack: false, status: false, snackMessage: lang[this.props.lang].CheckInternet })
            }
            this.props.changeTest(false)
        }
    }

    _disconnectVPN = () => {
        this.setState({ statusSnack: true, statusMessage: lang[this.props.lang].Disconnecting })
        var that = this;
        disconnectVPN(function (err) {
            if (err) {
                that.setState({ statusSnack: false, openSnack: true, snackMessage: err.message? err.message:'Disconnecting Failed.' })
                that.props.onChange();
            }
            else {
                that.props.onChange();
                that.setState({ selectedVPN: null, statusSnack: false, status: false, openSnack: true, snackMessage: lang[that.props.lang].DisconnectVPN })
            }
        });
    }

    getUsage() {
        let self = this;
        getVPNUsageData(this.props.local_address, function (err, usage) {
            if (err) {
                console.log('Err', err);
            }
            else {
                self.props.onChange();
                self.setState({ usage: usage })
            }
        })
    }

    vpnlistClicked(vpn) {
        vpn.latency = lang[this.props.lang].Loading;
        this.setState({ activeVpn: vpn, showPopUp: true })
        let self = this;
        getLatency(vpn.ip, function (err, latency) {
            if (err) console.log("Latency error..", err)
            else {
                vpn.latency = latency;
                localStorage.setItem(vpn.account_addr, latency);
                self.setState({ activeVpn: vpn })
            }
        })
    }

    handleClose = () => {
        this.setState({ showPopUp: false, showPay: false });
    };

    closeInstruction = () => {
        this.setState({ showInstruct: false });
    }

    snackRequestClose = () => {
        this.setState({
            openSnack: false
        });
    };

    payVPN = () => {
        let data = {
            account_addr: this.state.payAccount,
            amount: 10000000000,
            id: -1
        }
        this.props.vpnPayment(data);
        this.setState({ showPay: false })
    }

    downSort() {
        if (this.state.sortType === 'speed') {
            this.setState({ vpnUpdatedList: _.orderBy(this.state.vpnUpdatedList, o => o.net_speed.download).reverse(), sortUp: false })
        }
        else if (this.state.sortType === 'latency') {
            this.setState({ vpnUpdatedList: _.orderBy(this.state.vpnUpdatedList, o => o.latency).reverse(), sortUp: false })
        }
        else if (this.state.sortType === 'price') {
            this.setState({ vpnUpdatedList: _.orderBy(this.state.vpnUpdatedList, o => o.price_per_GB).reverse(), sortUp: false })
        }
        else {
            this.setState({ vpnUpdatedList: _.sortBy(this.state.vpnUpdatedList, o => o.location.city).reverse(), sortUp: false })
        }
    }

    upSort() {
        if (this.state.sortType === 'speed') {
            this.setState({ vpnUpdatedList: _.orderBy(this.state.vpnUpdatedList, o => o.net_speed.download), sortUp: true })
        }
        else if (this.state.sortType === 'latency') {
            this.setState({ vpnUpdatedList: _.orderBy(this.state.vpnUpdatedList, o => o.latency), sortUp: true })
        }
        else if (this.state.sortType === 'price') {
            this.setState({ vpnUpdatedList: _.orderBy(this.state.vpnUpdatedList, o => o.price_per_GB), sortUp: true })
        }
        else {
            this.setState({ vpnUpdatedList: _.sortBy(this.state.vpnUpdatedList, o => o.location.city), sortUp: true })
        }
    }

    searchVPN = (event) => {
        this.setState({ searchText: event.target.value })
        let list = this.state.vpnList;
        list = list.filter(function (item) {
            return (item.location.city.toLowerCase().search(
                event.target.value.toLowerCase()
            ) !== -1) || (item.location.country.toLowerCase().search(
                event.target.value.toLowerCase()
            ) !== -1);
        })
        this.setState({ vpnUpdatedList: list });
    }

    render() {
        let that = this;
        let language = this.props.lang;
        if (!this.state.isGetVPNCalled) {
            setInterval(function () {
                that.getVPNs()
                that.getDueAmount()
            }, 10000);

            this.setState({ isGetVPNCalled: true });
        }
        if (!UsageInterval && this.props.status) {
            UsageInterval = setInterval(function () {
                that.getUsage()
            }, 5000);
        }
        if (!this.props.status) {
            if (UsageInterval) {
                clearInterval(UsageInterval);
                UsageInterval = null;
            }
        }
        const instrucActions = [
            <FlatButton
                label={lang[language].Close}
                primary={true}
                onClick={this.closeInstruction}
            />
        ];
        const paymentActions = [
            <FlatButton
                label={lang[language].Close}
                primary={true}
                onClick={this.handleClose}
            />,
            <FlatButton
                label={lang[language].Pay}
                primary={true}
                onClick={this.payVPN.bind(this)}
            />,
        ];
        return (
            <div>
                {this.state.mapActive ?
                    <span></span>
                    :
                    <TextField
                        hintText={lang[language].SearchCity}
                        hintStyle={{ bottom: 4, paddingLeft: '2%' }}
                        style={{ backgroundColor: '#FAFAFA', height: 36, width: '79%', margin: 15, border: '1px solid rgba(0, 0, 0, 0.12)' }}
                        underlineShow={false}
                        onChange={this.searchVPN}
                        inputStyle={{ padding: '2%' }}
                    />
                }
                <span style={this.state.mapActive ? { marginLeft: '82%', marginTop: 15, position: 'absolute' } : {}}>
                    <RaisedButton
                        label={lang[language].List}
                        buttonStyle={this.state.mapActive ? {} : { backgroundColor: 'grey' }}
                        onClick={() => { this.setState({ mapActive: false }) }}
                    />
                    <RaisedButton
                        label={lang[language].Map}
                        buttonStyle={this.state.mapActive ? { backgroundColor: 'grey' } : {}}
                        onClick={() => { this.setState({ mapActive: true }) }}
                    />
                </span>
                {
                    this.state.mapActive ?
                        <div style={{ marginTop: -15 }}>
                            <IconButton onClick={this.handleZoomIn} style={{ position: 'absolute' }} tooltip="Zoom In">
                                <ZoomIn />
                            </IconButton>
                            <IconButton onClick={this.handleZoomOut} style={{ position: 'absolute', marginLeft: '4%' }}
                                tooltip="Zoom Out">
                                <ZoomOut />
                            </IconButton>
                            <hr />
                            <ComposableMap
                                projectionConfig={{ scale: 200 }}
                                style={this.props.isTest ? {
                                    width: "100%",
                                    height: 420,
                                    marginTop: '4%'
                                } : { width: "100%" }}
                            >
                                <ZoomableGroup zoom={this.state.zoom}>
                                    <Geographies geography="../src/Components/world-50m.json">
                                        {(geographies, projection) => geographies.map(geography => (
                                            <Geography
                                                key={geography.id}
                                                geography={geography}
                                                projection={projection}
                                                style={{
                                                    default: {
                                                        fill: "#ECEFF1",
                                                        stroke: "#607D8B",
                                                        strokeWidth: 0.75,
                                                        outline: "none",
                                                    },
                                                    hover: {
                                                        fill: "#CFD8DC",
                                                        stroke: "#607D8B",
                                                        strokeWidth: 0.75,
                                                        outline: "none",
                                                    },
                                                    pressed: {
                                                        fill: "#FF5722",
                                                        stroke: "#607D8B",
                                                        strokeWidth: 0.75,
                                                        outline: "none",
                                                    },
                                                }}
                                            />
                                        ))}
                                    </Geographies>
                                    <Markers>
                                        {this.state.markersList.map((marker, i) => (
                                            <Marker
                                                onMouseEnter={(marker, event) => {
                                                    document.getElementById(marker.name).style.visibility = "visible";
                                                }}
                                                onMouseLeave={(marker, event) => {
                                                    document.getElementById(marker.name).style.visibility = "hidden";
                                                }}
                                                key={i}
                                                marker={marker}
                                                onClick={this.handleClick.bind(this)}
                                                style={{
                                                    // default: { stroke: "#0cef0c" },
                                                    hover: { stroke: "#FF5722" },
                                                    pressed: { stroke: 'transparent' }
                                                }}
                                            >
                                                <g transform="translate(-12, -24)">
                                                    <path
                                                        fill={this.state.selectedVPN === marker.vpn.account_addr ? "green" : "currentColor"}
                                                        strokeWidth="2"
                                                        strokeLinecap="square"
                                                        strokeMiterlimit="10"
                                                        strokeLinejoin="miter"
                                                        d="M20,9c0,4.9-8,13-8,13S4,13.9,4,9c0-5.1,4.1-8,8-8S20,3.9,20,9z"
                                                    />
                                                    <circle
                                                        fill="white"
                                                        strokeWidth="2"
                                                        strokeLinecap="square"
                                                        strokeMiterlimit="10"
                                                        strokeLinejoin="miter"
                                                        cx="12"
                                                        cy="9"
                                                        r="3"
                                                    />
                                                </g>
                                                <text
                                                    id={marker.name}
                                                    textAnchor="middle"
                                                    y={-35}
                                                    style={{
                                                        fontFamily: "Roboto, sans-serif",
                                                        fill: "#607D8B",
                                                        stroke: "none",
                                                        fontWeight: 'bold',
                                                        visibility: "hidden",
                                                        boxSizing: 'content-box'
                                                    }}
                                                >
                                                    {marker.name}
                                                </text>
                                            </Marker>
                                        ))}
                                    </Markers>
                                </ZoomableGroup>
                            </ComposableMap>
                        </div >
                        :
                        <div style={{ height: 420 }}>
                            {this.state.vpnUpdatedList.length !== 0 ?
                                <List style={{ padding: 0 }}>
                                    <Row style={{ paddingLeft: 20, paddingRight: 35, paddingTop: 15, backgroundColor: '#ddd' }}>
                                        <Col xs={1}>
                                            <p style={{ fontWeight: 'bold' }}>{lang[language].Flag}</p>
                                        </Col>
                                        <Col xs={4}>
                                            <p style={{ fontWeight: 'bold', textAlign: 'center' }}>
                                                <a style={{ color: '#373a3c', cursor: 'pointer' }}
                                                    onClick={() => {
                                                        this.setState({
                                                            vpnUpdatedList: _.sortBy(this.state.vpnUpdatedList, o => o.location.city),
                                                            sortType: 'vpn',
                                                            sortUp: true
                                                        })
                                                    }}>{lang[language].VpnAddress}</a>
                                                {this.state.sortType === 'vpn' ?
                                                    <span>
                                                        {
                                                            this.state.sortUp ?
                                                                <Down onClick={this.downSort.bind(this)} style={{ width: 18, height: 18, cursor: 'pointer' }} /> :
                                                                <Up onClick={this.upSort.bind(this)} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                                                        }
                                                    </span>
                                                    : <span></span>}</p>
                                        </Col>
                                        <Col xs={2}>
                                            <p style={{ fontWeight: 'bold', textAlign: 'center' }}>
                                                <a style={{ color: '#373a3c', cursor: 'pointer' }}
                                                    onClick={() => {
                                                        this.setState({
                                                            vpnUpdatedList: _.orderBy(this.state.vpnUpdatedList, o => o.net_speed.download),
                                                            sortType: 'speed',
                                                            sortUp: true
                                                        })
                                                    }}>{lang[language].Bandwidth}</a>
                                                {this.state.sortType === 'speed' ?
                                                    <span>
                                                        {
                                                            this.state.sortUp ?
                                                                <Down onClick={this.downSort.bind(this)} style={{ width: 18, height: 18, cursor: 'pointer' }} /> :
                                                                <Up onClick={this.upSort.bind(this)} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                                                        }
                                                    </span>
                                                    : <span></span>}</p>
                                        </Col>
                                        <Col xs={2}>
                                            <p style={{ fontWeight: 'bold', textAlign: 'center' }}>
                                                <a style={{ color: '#373a3c', cursor: 'pointer' }}
                                                    onClick={() => {
                                                        this.setState({
                                                            vpnUpdatedList: _.orderBy(this.state.vpnUpdatedList, o => o.latency),
                                                            sortType: 'latency',
                                                            sortUp: true
                                                        })
                                                    }}>{lang[language].Latency}</a>
                                                {this.state.sortType === 'latency' ?
                                                    <span>
                                                        {this.state.sortUp ?
                                                            <Down onClick={this.downSort.bind(this)} style={{ width: 18, height: 18, cursor: 'pointer' }} /> :
                                                            <Up onClick={this.upSort.bind(this)} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                                                        }
                                                    </span>
                                                    : <span></span>}</p>
                                        </Col>
                                        <Col xs={3}>
                                            <p style={{ fontWeight: 'bold', textAlign: 'center' }}>
                                                <a style={{ color: '#373a3c', cursor: 'pointer' }}
                                                    onClick={() => {
                                                        this.setState({
                                                            vpnUpdatedList: _.orderBy(this.state.vpnUpdatedList, o => o.price_per_GB),
                                                            sortType: 'price',
                                                            sortUp: true
                                                        })
                                                    }}>{lang[language].Price}</a>
                                                {this.state.sortType === 'price' ?
                                                    <span>
                                                        {
                                                            this.state.sortUp ?
                                                                <Down onClick={this.downSort.bind(this)} style={{ width: 18, height: 18, cursor: 'pointer' }} /> :
                                                                <Up onClick={this.upSort.bind(this)} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                                                        }
                                                    </span>
                                                    : <span></span>}</p>
                                        </Col>
                                    </Row>
                                    <Divider />
                                    <div style={{
                                        height:
                                            this.state.dueAmount !== 0 && !this.props.status ? 320 : 365,
                                        overflowY: 'auto'
                                    }}>
                                        {this.state.vpnUpdatedList.map((vpn) =>
                                            <span >
                                                <ListItem primaryText={
                                                    <Row>
                                                        <Col xs={1}>
                                                            <Flag code={Country.getCode(vpn.location.country)} height="16" />
                                                        </Col>
                                                        <Col xs={4}>
                                                            <p style={{ textAlign: 'center', wordBreak: 'break-all' }}>{vpn.location.city}, {vpn.location.country}</p>
                                                        </Col>
                                                        <Col xs={2}>
                                                            <p style={{ textAlign: 'center' }}>{(vpn.net_speed.download / (1024 * 1024)).toFixed(2)} Mbps</p>
                                                        </Col>
                                                        <Col xs={2}>
                                                            <p style={{ textAlign: 'center' }}>{vpn.latency ? vpn.latency : 'None'}
                                                                {vpn.latency ? (vpn.latency === 'Loading...' ? null : ' ms') : null}</p>
                                                        </Col>
                                                        <Col xs={3}>
                                                            <p style={{ textAlign: 'center' }}>{vpn.price_per_GB ? vpn.price_per_GB : 100}</p>
                                                        </Col>
                                                        <ReactTooltip id="listOver" place="bottom">
                                                            <span>Click to Connect</span>
                                                        </ReactTooltip>
                                                    </Row>
                                                }
                                                    data-tip data-for="listOver"
                                                    onClick={() => { this.vpnlistClicked(vpn) }}
                                                    innerDivStyle={{
                                                        padding: 20, backgroundColor:
                                                            this.state.selectedVPN === vpn.account_addr ? '#d0e7ef' : 'white'
                                                    }} />
                                                <Divider />
                                            </span>
                                        )}
                                    </div>
                                </List>
                                :
                                <span style={{ marginLeft: '35%', position: 'absolute', marginTop: '20%' }}>
                                    {lang[language].NoServers}</span>
                            }
                        </div>
                }
                {!this.state.mapActive && !this.props.status && this.state.dueAmount === 0 ?
                    null :
                    <div style={styles.vpnDetails}>
                        {this.props.status === true ?
                            <div style={{ fontSize: 14 }}>
                                <p>IP: {this.props.vpnData.ip}</p>
                                <p>{lang[language].Location}: {this.props.vpnData.location}</p>
                                <p>{lang[language].Speed}: {this.props.vpnData.speed}</p>
                                <p>{lang[language].DownloadUsage}: {this.state.usage === null ? 0.00 : (parseInt(this.state.usage.down ? this.state.usage.down : 0) / (1024 * 1024)).toFixed(2)} MB</p>
                                <p>{lang[language].UploadUsage}: {this.state.usage === null ? 0.00 : (parseInt(this.state.usage.up ? this.state.usage.up : 0) / (1024 * 1024)).toFixed(2)} MB</p>
                                <RaisedButton
                                    label={lang[language].Disconnect}
                                    labelStyle={{ fontWeight: 'bold' }}
                                    primary={true}
                                    style={{ width: '100%' }}
                                    onClick={this._disconnectVPN.bind(this)}
                                />
                            </div>
                            :
                            <div>
                                {this.state.dueAmount === 0 ?
                                    lang[language].ClickVPN :
                                    <span>
                                        <span onClick={() => { this.payDue() }} data-tip data-for="payTip" style={{ cursor: 'pointer' }}>
                                            {lang[language].Uhave} {parseInt(this.state.dueAmount) / (10 ** 8)} SENTS {lang[language].Due}
                                        </span>
                                        <ReactTooltip id="payTip" place="top" type="warning">
                                            <span style={{ color: 'black' }}>{lang[language].ClickPay}</span>
                                        </ReactTooltip>
                                    </span>
                                }
                            </div>
                        }
                    </div>
                }
                < Dialog
                    title={lang[language].VPNDetails}
                    titleStyle={{ fontSize: 15, fontWeight: 'bold' }}
                    contentStyle={{ width: 350 }}
                    open={this.state.showPopUp}
                    onRequestClose={this.handleClose}
                >
                    <Row>
                        <Col xs={5}>
                            <p style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'right' }}>{lang[language].City}:</p>
                        </Col>
                        <Col xs={7}>
                            <p style={{ marginTop: -2 }}>{this.state.activeVpn ? this.state.activeVpn.location.city : ''}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={5}>
                            <p style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'right' }}>{lang[language].Country}:</p>
                        </Col>
                        <Col xs={7}>
                            <p style={{ marginTop: -2 }}>{this.state.activeVpn ? this.state.activeVpn.location.country : ''}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={5}>
                            <p style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'right' }}>{lang[language].Bandwidth}:</p>
                        </Col>
                        <Col xs={7}>
                            <p style={{ marginTop: -2 }}>{this.state.activeVpn ? (this.state.activeVpn.net_speed.download / (1024 * 1024)).toFixed(2) : ''} Mbps </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={5}>
                            <p style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'right' }}>{lang[language].Cost}:</p>
                        </Col>
                        <Col xs={7}>
                            <p style={{ marginTop: -2 }}>{this.state.activeVpn ? this.state.activeVpn.price_per_GB : ''} SENTS/GB</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={5}>
                            <p style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'right' }}>{lang[language].Latency}:</p>
                        </Col>
                        <Col xs={7}>
                            <p style={{ marginTop: -2 }}>{this.state.activeVpn ? this.state.activeVpn.latency : ''}
                                {this.state.activeVpn ? (this.state.activeVpn.latency === 'Loading...' ? null : 'ms') : null} </p>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '10%' }}>
                        <Col xs={6}>
                            <RaisedButton
                                label={lang[language].Close}
                                onClick={this.handleClose}
                                style={{ width: '100%' }}
                            />
                        </Col>
                        <Col xs={6}>
                            <RaisedButton
                                label={lang[language].Connect}
                                labelStyle={{ fontWeight: 'bold' }}
                                primary={true}
                                style={{ width: '100%' }}
                                onClick={this._connectVPN.bind(this)}
                            />
                        </Col>
                    </Row>
                </Dialog>
                <Snackbar
                    open={this.state.openSnack}
                    message={this.state.snackMessage}
                    autoHideDuration={2000}
                    onRequestClose={this.snackRequestClose}
                    style={{ marginBottom: '2%' }}
                />
                <Snackbar
                    open={this.state.statusSnack}
                    message={this.state.statusMessage}
                    style={{ marginBottom: '2%' }}
                />
                <Dialog
                    title="Install Dependencies"
                    titleStyle={{ fontSize: 14 }}
                    actions={instrucActions}
                    modal={true}
                    open={this.state.showInstruct}
                >
                    {this.state.isMac ?
                        <span>
                            This device does not have OpenVPN installed. Please install it by running below command: <br />
                            <code>brew install openvpn</code>
                            <CopyToClipboard text='brew install openvpn'
                                onCopy={() => this.setState({
                                    snackMessage: lang[language].Copied,
                                    openSnack: true
                                })} >
                                <img
                                    src={'../src/Images/download.jpeg'}
                                    alt="copy"
                                    data-tip data-for="copyImage"
                                    style={styles.clipBoardDialog}
                                />
                            </CopyToClipboard>
                            <br />
                            If brew is also not installed, then follow <a style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    this.openInExternalBrowser(`https://wwww.howtogeek.com/211541/homebrew-
                                            for-os-x-easily=installs-desktop-apps-and-terminal-utilities/`)
                                }}
                            >this page</a>
                        </span>
                        :
                        <span>
                            OpenVPN Not Installed.Install here https://openvpn.net/index.php/open-source/downloads.html.
                                    <CopyToClipboard text='https://openvpn.net/index.php/open-source/downloads.html'
                                onCopy={() => this.setState({
                                    snackMessage: lang[language].Copied,
                                    openSnack: true
                                })} >
                                <img
                                    src={'../src/Images/download.jpeg'}
                                    alt="copy"
                                    data-tip data-for="copyImage"
                                    style={styles.clipBoardDialog}
                                />
                            </CopyToClipboard>
                            <br />
                            Please install openvpn in default folder.(C:\\Program Files)
                        </span>
                    }
                </Dialog>
                <Dialog
                    title={lang[language].InitialPayment}
                    titleStyle={{ fontSize: 14 }}
                    actions={paymentActions}
                    modal={true}
                    open={this.state.showPay}
                >
                    <span>{lang[language].InorderVPN}</span>
                </Dialog>
                <ReactTooltip id="copyImage" place="bottom">
                    <span>{lang[language].Copy}</span>
                </ReactTooltip>
            </div >
        )
    }
}

const styles = {
    vpnDetails: {
        position: "absolute",
        bottom: 0,
        right: 15,
        backgroundColor: '#3e4f5a',
        padding: '10px',
        color: 'white'
    },
    testVpnDetails: {
        position: "absolute",
        bottom: 0,
        right: 10,
        marginBottom: 45,
        backgroundColor: '#3e4f5a',
        padding: '2%',
        color: 'white'
    },
    clipBoardDialog: {
        height: 14,
        width: 14,
        cursor: 'pointer',
        marginLeft: 5
    }
}

export default VPNComponent;