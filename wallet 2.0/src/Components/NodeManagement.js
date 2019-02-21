import React from "react";
import ImagesList from "./ImagesList";
import ContainersList from "./ContainersList";
import { IconButton } from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import CustomButton from "./customButton";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CopyIcon from "@material-ui/icons/FileCopyOutlined";
import lang from '../Constants/language';
// import { logoutNode, } from '../Actions/node.action';
import addNode from './AddNode';
import { setDockerImages, setDockerContainers, } from '../Actions/node.action';
import "./nodeStyle.css";


let ImagesInterval = null;
class NodeManagement extends React.Component {
  state = {
    isActive: "true",
    showing: "Images",
    ipHosted: null
  };

  componentWillMount = () => {

  }


  componentWillReceiveProps = () => {

  }

  componentWillUnmount = () => {
    // localStorage.setItem("Connected" , false)
  }

  handleNodeLogout = () => {
    this.props.logoutNode();

    // console.log("clearing the interval")
    // if(ImagesInterval){
    //   // console.log("clearing image")
    //   clearInterval(ImagesInterval);
    //   ImagesInterval = null;
    // }


  }
  showListOf(val) {
    this.setState({ showing: val });

  }
  render() {

    let { classes, language, connectionStatus } = this.props;
    // console.log("node add props ", this.props)
    this.onClickRefresh = () => {
      // console.log("refreshed ");
      this.props.setDockerImages();
      this.props.setDockerContainers();
    };

    return (

      <div className="mainDiv">
        <div className="SecondDiv">
          <div className="heading">{this.state.showing === "Images" ? lang[language].ImagesList : lang[language].ContainersList}</div>
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
                danger={true}
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
        {this.state.showing === "Images" ? <ImagesList /> : <ContainersList />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    language: state.setLanguage,
    connectionStatus: state.connectionStatus,
  }
}

function mapDispatchToActions(dispatch) {
  return bindActionCreators({
    // logoutNode,
    setDockerImages,
    setDockerContainers,

  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToActions)(NodeManagement);
