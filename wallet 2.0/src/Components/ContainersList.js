import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { compose } from 'recompose';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Card,} from "@material-ui/core";
import CopyIcon from "@material-ui/icons/FileCopyOutlined";
import lang from '../Constants/language';

import "./nodeStyle.css";

let NM = require('../nm-tools/nm');
var nm = new NM()

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  }
});

class ContainersList extends React.Component {
  state = {
    ip: "",
    root: "",
    pwd: ""
  };

  componentWillMount = () => {
    
  };
  handleClick() {
  }
  render() {
    let { language ,clientsData, ContainersData} = this.props;
    return (
      <div className="listData">
    {ContainersData === null ?
             <div style={{display: 'flex', justifyContent: 'center', paddingTop: '20%', fontSize: '25px'}}>{lang[language].Loading}</div> : 
          
          <div>
        { ContainersData === [] ? <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20%', fontSize: '25px'}}>{lang[language].NoNodeData}</div>: ContainersData.map( (item, i) => {
          return (
            <Card className="nodeCardStyle">
              <div className="leftDiv">
               
              <div>
                  <label className="nodeLabel">
                  {lang[language].ID}:&nbsp;<span className="nodeValue">{item.ID}</span>
                  </label>
                </div>
                <div>
                  <label className="nodeLabel">
                  {lang[language].Names}:&nbsp;<span className="nodeValue">{item.Names}</span>
                  </label>
                </div>
                <div>
                  <label className="nodeLabel">
                  {lang[language].Image}:&nbsp;<span className="nodeValue">{item.Image}</span>
                  </label>
                </div>

                <div>
                  <label className="nodeLabel">
                  {lang[language].CreatedAt}:&nbsp;<span className="nodeValue">{item.CreatedAt}</span>
                  </label>
                </div>
                
                <div>
                  <label className="nodeLabel">
                  {lang[language].RunningFor}:&nbsp;<span className="nodeValue">{item.RunningFor}</span>
                  </label>
                </div>
                <div>
                  <label className="nodeLabel">
                  {lang[language].Ports}:&nbsp;<span className="nodeValue">{item.Ports}</span>
                  </label>
                </div>
                 <div>
                  <label className="nodeLabel">
                  {lang[language].Mounts}:&nbsp;<span className="nodeValue">{item.Mounts}</span>
                  </label>
                </div>
              </div>
              <div className="rightDiv">
                <div>
                  <label className="nodeLabel">
                  {lang[language].Status}:&nbsp;
                    <span className="nodeValue">{item.Status} </span>
                  </label>
                </div>
                {/* <div>
                  <label className="nodeLabel">
                  {lang[language].Clients}:&nbsp;
                    <span className="nodeValue">{ clientsData[i].trim()} </span>
                  </label>
                 </div> */}
              </div>
            </Card>
         
          );
        })}
        </div>
            }
      </div>
      
    );
  }
}

ContainersList.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
      language: state.setLanguage,
      ContainersData : state.getDockerContainers,
      clientsData : state.getImagesClients,

     
  }
}

function mapDispatchToActions(dispatch) {
  return bindActionCreators({

  }, dispatch)
}

export default compose(withStyles(styles), connect(mapStateToProps, mapDispatchToActions))(ContainersList);
