import React from 'react';
import {IconButton, AppBar, Toolbar, Grid, Tooltip} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

class Topbar extends React.Component {
  render() {
    return (
        <React.Fragment>
          <AppBar>
            <Toolbar>
              <Grid container spacing={1} alignItems="center">
                <Grid item>
                  <input
                      type="text"
                      className="input"
                      placeholder="Search..."
                      onChange={this.handleChange()}
                  />
                </Grid>
                <Grid item alignContent="right" alignItems="right">
                  <Tooltip title="Edit">
                    <IconButton color="inherit">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>
        </React.Fragment>
    )
  }

  handleChange() {
    // ToDo: Implement searching logic
  }
}

export default Topbar;
