import React from 'react';
import {IconButton, AppBar, Toolbar, Grid, Tooltip} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import $ from "jquery";

/**
 * The Topbar contains the searchbar and header and is responsible for the searching.
 * Possible search results are handed over to parent via callback.
 * @author Aaron Saegesser
 */
class Topbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            term: ''
        };
    }

    /**
     * Gets the search results from the link '/search?q=' + this.state.term
     * and saves them into the icds array, this will be later passed on to the search results component
     * via callbackFromMainUI function
     */
    getAutoCompleteResults(e){
        this.setState({
            term: e.target.value
        }, () => {
            $.getJSON('/search?q=' + this.state.term)
                .then(async response =>
                    this.props.callbackFromMainUI(await response, this.state.term)
                )
        });
    }

    render() {
        return (
            <React.Fragment>
                <AppBar position="fixed">
                    <Toolbar variant="dense">
                        <Grid container spacing={5} alignItems="center" justify="flex-end">
                            <Grid item>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Search..."
                                    value={this.state.term}
                                    onChange={this.getAutoCompleteResults.bind(this)}
                                />
                            </Grid>
                            <Grid item xs />
                            <Grid item>
                                <h3>ICD mapping - eonum</h3>
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
                <Toolbar />
            </React.Fragment>
        )
    }
}

export default Topbar;
