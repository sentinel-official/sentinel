import React, { Component } from 'react';
import { sendError, setComponent } from '../Actions/authentication.action';
import { setCurrentTab } from '../Actions/sidebar.action';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setTestNet, setWalletType, setTendermint } from '../Actions/header.action';
import { readFile, KEYSTORE_FILE } from '../Utils/Keystore';
import Ripple from "rippl";
import "./home.css";

let lang = require('../Constants/language');

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openSnack: false,
            snackMessage: ''
        }
    }

    clickedEth = () => {
        readFile(KEYSTORE_FILE, (err) => {
            setTimeout(() => {
                if (err) this.props.setComponent('create');
                else this.props.setComponent('authenticate');
            }, 1000);
        })
    }

    clickedTm = () => {
        let currentTab = this.props.currentTab;
        this.props.setTestNet(true);
        this.props.setWalletType('TM');
        this.props.setTendermint(true);
        if (this.props.tmAccountDetails)
            this.props.setCurrentTab(currentTab);
        else
            this.props.setCurrentTab('receive');
        this.props.setComponent('dashboard');
    }

    render() {
        let language = this.props.language;
        return (
            <div className="main_div">
                <div className="section_1">
                    <div className="section1_child">
                        <div className="heading_section">
                            <img
                                src={'../src/Images/SENT_logo.svg'}
                                width="300px"
                                alt="logo"
                            />
                        </div>
                        <div className="client_div">
                            <span className="desk_1">{lang[language].DesktopClient}</span>
                            <span className="version">{lang[language].DesktopClientVersion}</span>
                        </div>
                        <Ripple>
                            <div className="network_section_1"
                                onClick={() => { this.clickedTm() }} >
                                <img
                                    src={'../src/Images/TM.svg'}
                                    width="30px"
                                    alt="Tendermint_logo"
                                />
                                <div>
                                    <div className="btn_div">
                                        <p>{lang[language].TMNetworkMain}</p>
                                        <p>{lang[language].TMNetworkSub}</p>
                                    </div>
                                </div>
                                <div className="arrow">
                                    <img
                                        src={'../src/Images/Arrow.svg'}
                                        width="30px"
                                        alt="Arrow"
                                    />
                                </div>
                            </div>
                        </Ripple>
                        <Ripple>
                            <div className="network_section_2 section_a"
                                onClick={() => { this.clickedEth() }} >
                                <img
                                    src={'../src/Images/Classic.svg'}
                                    width="30px"
                                    alt="Ethereum"
                                />
                                <div>
                                    <div className="btn_div">
                                        <p>{lang[language].ETHNetworkMain}</p>
                                        <p>{lang[language].ETHNetworkSub}</p>
                                    </div>
                                </div>
                                <div className="arrow">
                                    <img
                                        src={'../src/Images/Arrow.svg'}
                                        width="30px"
                                        alt="Arrow"
                                    />
                                </div>
                            </div>
                        </Ripple>
                    </div>
                </div>
                <div className="section_2">
                    {/* <div className="open_app">
                        <div>{lang[language].HomeOpenSource}</div>
                        <div>{lang[language].ApplicationIncludes}:</div>
                    </div> */}

                    <div className="includes">
                        <div className="give_space">
                            <div>
                                {/* <CheckCircleIcon style={{ fontSize: 15, color: "blue" }} /> */}
                                <img
                                    src={'../src/Images/check-mark.svg'}
                                    width="15px"
                                    alt="tick"
                                    className="ticks"
                                />
                                <span>{lang[language].Includes1}</span>
                            </div>
                        </div>
                        <div>
                            <img
                                src={'../src/Images/check-mark.svg'}
                                width="15px"
                                alt="tick"
                                className="ticks"
                            />
                            {/* <CheckCircleIcon style={{ fontSize: 15, color: "blue" }} /> */}
                            {lang[language].Includes2}
                        </div>
                    </div>
                    <div className="includes">
                        <div className="give_space">
                            <img
                                src={'../src/Images/check-mark.svg'}
                                width="15px"
                                alt="tick"
                                className="ticks"
                            />
                            {/* <CheckCircleIcon style={{ fontSize: 15, color: "blue" }} /> */}
                            {lang[language].Includes3}
                        </div>
                        <div>
                            <img
                                src={'../src/Images/check-mark.svg'}
                                width="15px"
                                alt="tick"
                                className="ticks"
                            />
                            {/* <CheckCircleIcon style={{ fontSize: 15, color: "blue" }} /> */}
                            {lang[language].Includes4}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        language: state.setLanguage,
        tmAccountDetails: state.setTMAccount,
        currentTab: state.setCurrentTab,
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        setComponent: setComponent,
        setTestNet,
        setTendermint,
        setWalletType,
        setCurrentTab,
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToActions)(Home);
