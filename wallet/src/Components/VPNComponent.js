import React, { Component } from 'react';
import { getVPNList, connectVPN, getVPNUsageData, isOnline } from '../Actions/AccountActions';
import ZoomIn from 'material-ui/svg-icons/content/add';
import { Grid, Row, Col } from 'react-flexbox-grid';
import CopyToClipboard from 'react-copy-to-clipboard';
import _ from 'lodash';
import ZoomOut from 'material-ui/svg-icons/content/remove';
import { IconButton, RaisedButton, List, ListItem, Divider, Dialog, FlatButton, Snackbar } from "material-ui";
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
            markersList: ''
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
        console.log("Marker data: ", marker)
    }
    componentWillMount = () => {
        this.getVPNs()
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ status: nextProps.status })
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
                        coordinates: [vpn.location.longitude, vpn.location.latitude]
                    }
                    markers.push(vpnServer);
                })
                self.setState({ vpnList: _.sortBy(data, o => o.location.city), markersList: markers })
            }
        })
    }

    _connectVPN = () => {
        if (this.state.status) {
            this.setState({ showPopUp: false, openSnack: true, snackMessage: 'You are already connected to one VPN. Disconnect it and try again.' })
        }
        else {
            this.props.changeTest(true);
            this.setState({ showPopUp: false, statusSnack: true, statusMessage: 'Connecting...Please Wait' })
            let that = this;
            if (isOnline()) {
                connectVPN(this.props.local_address, this.state.activeVpn.account_addr, function (err, isMacError, isWinError, account) {
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
                        that.setState({ status: true, statusSnack: false, showInstruct: false, openSnack: true, snackMessage: "Connected VPN" })
                    }
                })
            }
            else {
                this.setState({ openSnack: true, statusSnack: false, status: false, snackMessage: 'Check your Internet Connection' })
            }
            this.props.changeTest(false)
        }
    }

    getUsage() {
        let self = this;
        getVPNUsageData(this.props.local_address, function (err, usage) {
            if (err) {
                console.log('Err', err);
            }
            else {
                self.setState({ usage: usage })
            }
        })
    }

    vpnlistClicked(vpn) {
        this.setState({ activeVpn: vpn, showPopUp: true })
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

    render() {
        let that = this;
        if (!this.state.isGetVPNCalled) {
            setInterval(function () {
                that.getVPNs()
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
                label="Close"
                primary={true}
                onClick={this.closeInstruction}
            />
        ];
        const paymentActions = [
            <FlatButton
                label="Close"
                primary={true}
                onClick={this.handleClose}
            />,
            <FlatButton
                label="Pay"
                primary={true}
                onClick={this.payVPN.bind(this)}
            />,
        ];
        return (
            <div>
                <span style={{ marginLeft: '82%' }}>
                    <RaisedButton
                        label="List"
                        buttonStyle={this.state.mapActive ? {} : { backgroundColor: 'grey' }}
                        onClick={() => { this.setState({ mapActive: false }) }}
                    />
                    <RaisedButton
                        label="Map"
                        buttonStyle={this.state.mapActive ? { backgroundColor: 'grey' } : {}}
                        onClick={() => { this.setState({ mapActive: true }) }}
                    />
                </span>
                {this.state.mapActive ?
                    <div style={{ marginTop: -50 }}>
                        <IconButton onClick={this.handleZoomIn} style={{ position: 'absolute' }} tooltip="Zoom In">
                            <ZoomIn />
                        </IconButton>
                        <IconButton onClick={this.handleZoomOut} style={{ position: 'absolute', marginLeft: '3%' }}
                            tooltip="Zoom Out">
                            <ZoomOut />
                        </IconButton>
                        <div style={styles.vpnDetails}>
                            {this.props.status === true ?
                                <div style={{ fontSize: 14 }}>
                                    <p>IP: {this.props.vpnData.ip}</p>
                                    <p>Location: {this.props.vpnData.location}</p>
                                    <p>Speed: {this.props.vpnData.speed}</p>
                                    <p>Download Usage: {this.state.usage === null ? 0.00 : (parseInt(this.state.usage.down ? this.state.usage.down : 0) / (1024 * 1024)).toFixed(2)} MB</p>
                                    <p>Upload Usage: {this.state.usage === null ? 0.00 : (parseInt(this.state.usage.up ? this.state.usage.up : 0) / (1024 * 1024)).toFixed(2)} MB</p>
                                </div>
                                :
                                <div>No VPN Connected</div>
                            }
                        </div>
                        <hr />
                        <ComposableMap
                            projectionConfig={{ scale: 200 }}
                            style={this.props.isTest ? {
                                width: "100%",
                                height: 430,
                                marginTop: '2%'
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
                                            style={{
                                                default: { stroke: "#0cef0c" },
                                                hover: { stroke: "#FF5722" },
                                                pressed: { stroke: "#FF5722" },
                                            }}
                                        >
                                            <g transform="translate(-12, -24)">
                                                <path
                                                    fill="none"
                                                    strokeWidth="2"
                                                    strokeLinecap="square"
                                                    strokeMiterlimit="10"
                                                    strokeLinejoin="miter"
                                                    d="M20,9c0,4.9-8,13-8,13S4,13.9,4,9c0-5.1,4.1-8,8-8S20,3.9,20,9z"
                                                />
                                                <circle
                                                    fill="none"
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
                                                    visibility: "hidden",
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
                    <div style={{ height: 445, overflowY: 'auto' }}>
                        {this.state.vpnList.length !== 0 ?
                            <List style={{ padding: 0 }}>
                                {this.state.vpnList.map((vpn) =>
                                    <span>
                                        <ListItem primaryText={
                                            <Row>
                                                <Col xs={1}>
                                                    <Flag code={Country.getCode(vpn.location.country)} height="16" />
                                                </Col>
                                                <Col xs={5}>
                                                    {vpn.location.city}, {vpn.location.country}
                                                </Col>
                                                <Col xs={3}>
                                                    {(vpn.net_speed.download / (1024 * 1024)).toFixed(2)} Mbps
                                                </Col>
                                                <Col xs={3}>
                                                    {vpn.latency ? vpn.latency : 'None'} ms
                                                </Col>
                                                <ReactTooltip id="listOver" place="bottom">
                                                    <span>Click to Connect</span>
                                                </ReactTooltip>
                                            </Row>
                                        }
                                            data-tip data-for="listOver"
                                            onClick={() => { this.vpnlistClicked(vpn) }}
                                            innerDivStyle={{ padding: 20 }} style={{}} />
                                        <Divider />
                                    </span>
                                )}
                            </List>
                            :
                            <span style={{ marginLeft: '35%', position: 'absolute', marginTop: '20%' }}>
                                Currently, no VPN servers are available.</span>
                        }
                        <Dialog
                            title="VPN Details"
                            titleStyle={{ fontSize: 15, fontWeight: 'bold' }}
                            contentStyle={{ width: 350 }}
                            open={this.state.showPopUp}
                            onRequestClose={this.handleClose}
                        >
                            <Row>
                                <Col xs={5}>
                                    <p style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'right' }}>City:</p>
                                </Col>
                                <Col xs={7}>
                                    <p>{this.state.activeVpn ? this.state.activeVpn.location.city : ''}</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={5}>
                                    <p style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'right' }}>Country:</p>
                                </Col>
                                <Col xs={7}>
                                    <p>{this.state.activeVpn ? this.state.activeVpn.location.country : ''}</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={5}>
                                    <p style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'right' }}>Bandwidth:</p>
                                </Col>
                                <Col xs={7}>
                                    <p>{this.state.activeVpn ? (this.state.activeVpn.net_speed.download / (1024 * 1024)).toFixed(2) : ''} Mbps </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={5}>
                                    <p style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'right' }}>Latency:</p>
                                </Col>
                                <Col xs={7}>
                                    <p>{this.state.activeVpn ? this.state.activeVpn.latency : ''} ms </p>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: '10%' }}>
                                <Col xs={6}>
                                    <RaisedButton
                                        label="Close"
                                        onClick={this.handleClose}
                                        style={{ width: '100%' }}
                                    />
                                </Col>
                                <Col xs={6}>
                                    <RaisedButton
                                        label="Connect"
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
                                            snackMessage: 'Copied to Clipboard Successfully',
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
                                            snackMessage: 'Copied to Clipboard Successfully',
                                            openSnack: true
                                        })} >
                                        <img
                                            src={'../src/Images/download.jpeg'}
                                            alt="copy"
                                            data-tip data-for="copyImage"
                                            style={styles.clipBoardDialog}
                                        />
                                    </CopyToClipboard>

                                </span>
                            }
                        </Dialog>
                        <Dialog
                            title="Initial Payment Reminder"
                            titleStyle={{ fontSize: 14 }}
                            actions={paymentActions}
                            modal={true}
                            open={this.state.showPay}
                        >
                            <span>
                                Inorder to use VPN, you need to pay 100 sents for the first time. Please pay and then try to connect to the vpn.
                            </span>
                        </Dialog>
                        <ReactTooltip id="copyImage" place="bottom">
                            <span>Copy</span>
                        </ReactTooltip>
                    </div>
                }
            </div>
        )
    }
}

const styles = {
    vpnDetails: {
        position: "absolute",
        bottom: 0,
        right: 10,
        backgroundColor: '#3e4f5a',
        padding: '2%',
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