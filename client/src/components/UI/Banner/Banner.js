import React, { Component } from 'react';
import classes from './Banner.module.scss';

class Banner extends Component {
  render() {
    return <div className={classes.Banner}>{this.props.children}</div>;
  }
}

export default Banner;
