import React from "react";
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from "@material-ui/core/styles";
import { Card} from "@material-ui/core";
import { compose } from 'recompose';
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

class ImagesList extends React.Component {
  state = {
  containerData : ''
  };

  componentWillMount = () => {
   
  }
  handleClick() {
  }
  render() {
    let {  language,  ImagesData } = this.props;

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

  }, dispatch)
}

export default compose(withStyles(styles), connect(mapStateToProps, mapDispatchToActions))(ImagesList);
