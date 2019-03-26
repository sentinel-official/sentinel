import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { compose } from 'recompose';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { setDockerContainers } from '../Actions/node.action';
import { Card,Tooltip, Snackbar} from "@material-ui/core";
import lang from '../Constants/language';
import CountUp from 'react-countup';
import CopyIcon from "@material-ui/icons/FileCopyOutlined";
import CopyToClipboard from 'react-copy-to-clipboard';
import { receiveStyles } from './../Assets/receive.styles';
import "./nodeStyle.css";

let NM = require('../NM-Tools/nm');
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
    openSnack: false,
    snackMessage: '',
  };

  componentWillMount = () => {
    this.props.setDockerContainers();
  };
  handleClick() {
  }
  render() {
    let { language ,clientsData, ContainersData} = this.props;
    console.log("setting contatiner ", ContainersData, clientsData)
    return (
      <div className="listData">
    { (ContainersData === null || clientsData === null) ?
             <div style={{display: 'flex', justifyContent: 'center', paddingTop: '20%', fontSize: '25px'}}>{lang[language].Loading}</div> : 
          
          <div>
        { ContainersData === [] ? <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20%', fontSize: '25px'}}>{lang[language].NoNodeData}</div>: 
        ContainersData.map( (item, i) => {
          let a,b,c,d,s,newStatus;
          a = item.Status;
          b = a.split(" ");
          c =  b[0] === "Up" && b[1] !== "About" ? (b.splice(1,0,"since")) : "";
          d = b.join(" ");
          s = d.toLowerCase();
          newStatus = s.charAt(0).toUpperCase() + s.slice(1);
          return (
            <Card className="nodeCardStyle">
              <div className="leftDiv">
               
              <div>
                  <label className="nodeLabel">
                  {lang[language].ID}:&nbsp;<span className="nodeValue">{item.ID}</span>
                  </label>
                  <Tooltip title={lang[language].Copy}>
                    <CopyToClipboard text={item.ID}
                      onCopy={() => this.setState({
                        snackMessage: lang[language].Copied,
                        openSnack: true
                      })}>

                      <CopyIcon style={receiveStyles.clipBoard} />
                    </CopyToClipboard>
                  </Tooltip>
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
                  {lang[language].RunningFor}:&nbsp;<span className="nodeValue">{item.RunningFor.slice(0,-3)}</span>
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
                  <label className="nodeLabel" >
                  {lang[language].Status}:&nbsp;
                    <span className="nodeValue" >
                    {newStatus} 
                    </span>
                  </label>
                </div>
                <div>
                  <label className="nodeLabel">
                  {lang[language].Clients}:&nbsp;
                    <span className="nodeValue">{ <CountUp start={0} end={clientsData[i]} />} </span>

                    {/* <span className="nodeValue">{clientsData[i] === undefined ? "undef" : clientsData[i]} </span> */}

                  </label>
                 </div>
              </div>
            </Card>
         
          );
        })}
        </div>
            }

                <Snackbar
                    open={this.state.openSnack}
                    autoHideDuration={4000}
                    onClose={this.handleClose}
                    message={this.state.snackMessage}
                />
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
    setDockerContainers,
  }, dispatch)
}

export default compose(withStyles(styles), connect(mapStateToProps, mapDispatchToActions))(ContainersList);
