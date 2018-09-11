import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setCurrentVpn } from '../Actions/vpnlist.action';
import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography,
    Markers,
    Marker
} from 'react-simple-maps';
import SimpleDialogDemo from "./customDialog";

class VpnMapView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            zoom: 1,
            markersList: [],
            openDialog: false,
            data: {},
        }
    }

    componentWillReceiveProps = (nextProps) => {
        let list = nextProps.availableVpns;
        if (this.props.isTM) {
            list.map((node) => {
                node.net_speed = node.netSpeed;
                node.account_addr = node.accountAddress;
                node.price_per_GB = node.pricePerGB;
                node.enc_method = node.encMethod;
                node.ip = node.IP;
            })
        }
        let markers = [];
        if (list.length !== 0) {
            list.map((vpn) => {
                let vpnServer = {
                    name: vpn.location.city,
                    vpn: vpn,
                    coordinates: [vpn.location.longitude, vpn.location.latitude]
                };
                markers.push(vpnServer);
            });
        }
        this.setState({ markersList: markers, zoom: nextProps.zoom });
    };

    componentDidMount() {
        let list = this.props.availableVpns;
        if (this.props.isTM) {
            list.map((node) => {
                node.net_speed = node.netSpeed;
                node.account_addr = node.accountAddress;
                node.price_per_GB = node.pricePerGB;
                node.enc_method = node.encMethod;
                node.ip = node.IP;
            })
        }
        let markers = [];
        if (list.length !== 0) {
            list.map((vpn) => {
                let vpnServer = {
                    name: vpn.location.city,
                    vpn: vpn,
                    coordinates: [vpn.location.longitude, vpn.location.latitude]
                };
                markers.push(vpnServer);
            });
            this.setState({ markersList: markers });
        }
    }

    handleClick = (marker, event) => {
        let data = {
            'city': marker.vpn.location.city, 'country': marker.vpn.location.country,
            'speed': marker.vpn.bandwidth, 'latency': marker.vpn.latency,
            'price_per_GB': marker.vpn.price_per_GB, 'vpn_addr': marker.vpn.account_addr
        }
        this.props.setCurrentVpn(data);
        this.setState({
            openDialog: true, data: data
        })
    };

    changeDialog = (value) => {
        this.setState({ openDialog: value });
    };

    render() {
        return (
            <div>
                <ComposableMap
                    projectionConfig={{ scale: 200 }}
                    style={{
                        width: "100%",
                        height: 420,
                    }}
                >
                    <ZoomableGroup zoom={this.state.zoom}>
                        <Geographies geography="../src/Constants/world-50m.json">
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
                                    onClick={this.handleClick}
                                    style={{
                                        hover: { stroke: "#FF5722" },
                                        pressed: { stroke: 'transparent' }
                                    }}
                                >
                                    <g transform="translate(-12, -24)">
                                        <path
                                            // fill={this.state.selectedVPN === marker.vpn.account_addr ? "green" : "currentColor"}
                                            fill={"currentColor"}
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
                <div style={{ width: 280 }} >
                    <SimpleDialogDemo open={this.state.openDialog} onUpdate={this.changeDialog} />
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        lang: state.setLanguage,
        availableVpns: state.getVpnList,
        isTM: state.setTendermint
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        setCurrentVpn
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToActions)(VpnMapView);