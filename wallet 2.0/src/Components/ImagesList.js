import React from "react";
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setDockerImages } from '../Actions/node.action';
import { withStyles } from "@material-ui/core/styles";
import { Card,Tooltip, Snackbar} from "@material-ui/core";
import { compose } from 'recompose';
import lang from '../Constants/language';
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

class ImagesList extends React.Component {
  state = {
  containerData : '',
  openSnack: false,
  snackMessage: '',
  };

  componentWillMount = () => {
    this.props.setDockerImages() 
  }
  handleClick() {
  }
  render() {
    let {  language,  ImagesData } = this.props;
    console.log(" setting images list ", ImagesData);

    return (
      <div className="listData">
         
            {ImagesData === null ?
             <div style={{display: 'flex', justifyContent: 'center', paddingTop: '20%', fontSize: '25px'}}>{lang[language].Loading}</div> : 
          
          <div>
          {ImagesData === [] ? <div style={{display: 'flex', justifyContent: 'center', paddingTop: '20%', fontSize: '25px'}}>{lang[language].NoNodeData}</div>: ImagesData.map(item => {
          return (
            <Card className="nodeCardStyle">
              <div className="leftDiv">
              <div>
                  <label className="nodeLabel">
                  {lang[language].ID}:&nbsp;
                    <span className="nodeValue">{item.ID}</span>
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
                  {lang[language].Repository}:&nbsp;
                    <span className="nodeValue">{item.Repository}</span>
                  </label>
                </div>
                <div>
                  <label className="nodeLabel">
                  {lang[language].Tag}:&nbsp;
                    <span className="nodeValue">{item.Tag}</span>
                  </label>
                </div>
                <div>
                  <label className="nodeLabel">
                  {lang[language].CreatedSince}:&nbsp;
                    <span className="nodeValue">{item.CreatedSince}</span>
                  </label>
                </div>

                <div>
                  <label className="nodeLabel">
                  {lang[language].CreatedAt}:&nbsp;
                    <span className="nodeValue">{item.CreatedAt}</span>
                  </label>
                </div>
              
                <div>
                  <label className="nodeLabel">
                  {lang[language].Size}:&nbsp;<span className="nodeValue">{item.Size}</span>
                  </label>
                </div>

              
              </div>
              <div className="rightDiv">
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

ImagesList.propTypes = {
  classes: PropTypes.object.isRequired
};


function mapStateToProps(state) {
  return {
      language: state.setLanguage,
      ImagesData : state.getDockerImages,
     
  }
}

function mapDispatchToActions(dispatch) {
  return bindActionCreators({
    setDockerImages,

  }, dispatch)
}

export default compose(withStyles(styles), connect(mapStateToProps, mapDispatchToActions))(ImagesList);
