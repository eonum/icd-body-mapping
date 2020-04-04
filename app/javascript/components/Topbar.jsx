import React from 'react';
import {IconButton, AppBar, Toolbar, Grid, Tooltip} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
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
            term: ''
        };
    }

    componentDidMount() {
        const url = "/icds";
        fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response wasn't ok.");
            })
            .then(async response => this.setIcdDatabaseStorage(await response))
            .catch(() => this.props.history.push("/"));
    }

    setIcdDatabaseStorage(icds) {
        this.allICDs = icds;
    }

    /**
     * Gets the search results from the link '/search?q=' + this.state.term
     * and saves them into the ICD's array, this will be later passed on to the search results component
     * via callbackFromMainUI function
     */
    getSearchResults(){
        /*console.log(this.allICDs);
        this.setState({
            term: search.target.value
        });

        const searchedICD = this.allICDs.filter((icd) => {
            if (icd.code.toString().includes(this.state.term)) {
                return icd;
            }
        });

        console.log(searchedICD);

        this.props.callbackFromMainUI(searchedICD, this.state.term);
        */

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
                                <input
                                    type="text"
                                    className="input"
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
