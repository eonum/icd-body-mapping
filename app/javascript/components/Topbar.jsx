import React from 'react';
import {IconButton, AppBar, Toolbar, Grid, Tooltip} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search';
import $ from "jquery";

/**
 * The Topbar contains the searchbar and header and is responsible for the searching.
 * Possible search results are handed over to parent MainUI via callback.
 * @author Aaron Saegesser
 */
class Topbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            term: ''
        };
    }

    /**
     * Gets the search results from the link '/search?q=' + this.state.term
     * and saves them into the ICD's array, this will be later passed on to the search results component
     * via callbackFromMainUI function
     */
    getSearchResults(){
            $.getJSON('/search?q=' + this.state.term)
                .then(async response =>
                    this.props.callbackFromMainUI(await response, this.state.term)
                );
    }

    render() {
        return (
            <React.Fragment>
                <AppBar position="fixed">
                    <Toolbar variant="dense">
                        <Grid container spacing={5} alignItems="center" justify="flex-end">
                            <Grid item>
                                <SearchIcon />
                                <input id="input"
                                    type="text"
                                    placeholder="Search..."
                                    onChange={event => {this.setState({term: event.target.value})}}
                                    onKeyDown={event => {if (event.key === 'Enter') {this.getSearchResults()}}}
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
