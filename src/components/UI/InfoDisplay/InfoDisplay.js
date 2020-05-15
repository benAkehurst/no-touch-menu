import React, { Component } from 'react';
import classes from './InfoDisplay.module.scss';

class InfoDisplay extends Component {
  /**
   * Props:
   * children: Text placed between <InfoDisplay></InfoDisplay> tags
   */

  render() {
    let appId = null;
    if (this.props.dispStr) {
      appId = this.props.dispStr.substr(1);
    }
    return <p className={classes.InfoDispalay}>ID - {appId}</p>;
  }
}

export default InfoDisplay;
