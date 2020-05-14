import React, { Component } from 'react';
import classes from './Banner.module.scss';

import Aux from '../../../hoc/Aux/Aux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

class Banner extends Component {
  showLogo = () => {
    return <div>Logo</div>;
  };

  showUserButtons = () => {
    return (
      <div className={'Buttons-wrapper'}>
        <Button color="inherit">Profile</Button>
        <Button color="inherit">Restaurant</Button>
      </div>
    );
  };

  render() {
    return (
      <Aux>
        <AppBar position="static">
          <Toolbar>
            <Typography edge="start" variant="h6">
              {this.props.siteName}
            </Typography>
            {this.props.showLogo ? this.showLogo() : null}
            {this.props.showUserButtons ? this.showUserButtons() : null}
          </Toolbar>
        </AppBar>
      </Aux>
    );
  }
}

export default Banner;
