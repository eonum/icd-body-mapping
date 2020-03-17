import React from 'react';
import {IconButton, AppBar, Toolbar, Grid, Tooltip} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

class Topbar extends React.Component {
    render() {
        return (
            <div>
                <AppBar position="fixed">
                    <Toolbar variant="dense">
                        <Grid container spacing={5} alignItems="center" justify="flex-end">
                            <Grid item>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Search..."
                                    onChange={this.handleSearch()}
                                />
                            </Grid>
                            <Grid item xs />
                            <Grid item>
                                <h3>ICD mapping - EONUM</h3>
                            </Grid>
                            <Grid item>
                                <Tooltip title="Edit">
                                    <IconButton color="inherit">
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }

    handleSearch() {
      // ToDo: Implement searching logic
    }
}

export default Topbar;
