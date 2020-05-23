import React, { Component } from 'react';

import Aux from '../../../hoc/Aux/Aux';
import helpers from '../../../Helpers/localStorage';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

class Banner extends Component {
  logout = () => {
    helpers.clearStorage();
    window.location.reload();
  };

  showLogo = () => {
    return <div>Logo</div>;
  };

  showUserButtons = () => {
    return (
      <div style={{ 'margin-left': 'auto' }}>
        <Button color="inherit" onClick={() => this.logout()}>
          Logout
        </Button>
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
