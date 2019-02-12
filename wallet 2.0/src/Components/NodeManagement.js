import React from "react";
import ImagesList from "./ImagesList";
import ContainersList from "./ContainersList";
import { IconButton } from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import CustomButton from "./customButton";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import CopyIcon from "@material-ui/icons/FileCopyOutlined";
import lang from '../Constants/language';
import {logoutNode } from '../Actions/node.action';
import { setCurrentTab } from '../Actions/sidebar.action';
import addNode from './AddNode';

import "./nodeStyle.css";
import AddNode from "./AddNode";


let NM = require('../nm-tools/nm');

var nm = new NM()

class NodeManagement extends React.Component {
  state = {
    isActive: "true",
    showing: "Images",
    parent : false,
  };

  componentWillMount = () => {
    
  }
  componentWillUnmount = () => {
    // localStorage.setItem("Connected" , false)
  }
  handleNodeLogout(){
    this.props.logoutNode(true);
    this.setState({ parent: true});
  }
  showListOf(val) {
    this.setState({ showing: val });
   
  }
  render() {

    let { classes, language} = this.props;
    // console.log("node add props ", this.props)

    
    this.onClickRefresh = () => {
      
    };

    return (

      <div>
        {this.state.parent === true ? < AddNode /> :  
     
      <div className="mainDiv">
        <div className="SecondDiv">
          <div className="heading">{this.state.showing === "Images" ? lang[language].ImagesList : lang[language].ContainersList }</div>
          <div className="buttonsGroup">
            {/* <div className="giveSpace">
              <IconButton
                aria-label="Refresh"
                onClick={() => {
                  this.onClickRefresh();
                }}
              >
                <RefreshIcon />
              </IconButton>
            </div> */}
            <div className="nodeGiveSpace">
              <CustomButton
                color={"#FFFFFF"}
                label={lang[language].Images}
                active={this.state.showing !== "Images"}
                onClick={() => {
                  this.showListOf("Images");
                }}
              />
            </div>
            <div className="nodeGiveSpaceEnd">
              <CustomButton
                color={"#F2F2F2"}
                label={lang[language].Containers}
                active={this.state.showing !== "Containers"}
                onClick={() => {
                  this.showListOf("Containers");
                }}
              />
            </div>
            <div className="logoutButton">
              <CustomButton
                color={"#d9534f"}
                danger ={true}
                label={lang[language].Logout}
                // active={this.state.showing === "Images"}
                active={true}
                onClick={() => {
                  this.handleNodeLogout();
                }}
              />
            </div>

          </div>
        </div>
        {this.state.showing === "Images" ? <ImagesList/> : <ContainersList/>}
      </div>
        }
         </div>
    );
  }
}

function mapStateToProps(state) {
  return {
      language: state.setLanguage,
     
  }
}

function mapDispatchToActions(dispatch) {
  return bindActionCreators({
    logoutNode,
    setCurrentTab,

  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToActions)(NodeManagement);
