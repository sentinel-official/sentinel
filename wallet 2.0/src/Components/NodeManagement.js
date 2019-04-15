import React from "react";
import ImagesList from "./ImagesList";
import ContainersList from "./ContainersList";
import { IconButton } from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import CustomButton from "./customButton";
import "./nodeStyle.css";

class NodeManagement extends React.Component {
  state = {
    isActive: "true",
    showing: "Images"
  };

  showListOf(val) {
    console.log("val is ", val);
    this.setState({ showing: val });
    console.log("val show", this.state.showing);
  }
  render() {
    this.onClickRefresh = () => {
      console.log("refresh clicked");
    };

    return (
      <div className="mainDiv">
        <div className="SecondDiv">
          <div className="heading">{this.state.showing} List</div>
          <div className="buttonsGroup">
            <div className="">
              <IconButton
                aria-label="Refresh"
                onClick={() => {
                  this.onClickRefresh();
                }}
              >
                <RefreshIcon />
              </IconButton>
            </div>
            <div>
              <CustomButton
                color={"#FFFFFF"}
                label="Images"
                active={this.state.showing === "Images"}
                onClick={() => {
                  this.showListOf("Images");
                }}
              />
            </div>
            <div>
              <CustomButton
                color={"#F2F2F2"}
                label="Containers"
                active={this.state.showing === "Containers"}
                onClick={() => {
                  this.showListOf("Containers");
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
export default NodeManagement;
