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
            <div className="navbar navbar-expand-lg navbar-light bg-primary">
                <a className="navbar-brand" href="#">ICD Mapping - EONUM</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <a className="nav-link" href="#">Ho <span className="sr-only">(current)</span></a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Link</a>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                               data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Dropdown
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a className="dropdown-item" href="#">Action</a>
                                <a className="dropdown-item" href="#">Another action</a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="#">Something else here</a>
                            </div>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link disabled" href="#" tabIndex="-1" aria-disabled="true">Disabled</a>
                        </li>
                    </ul>
                    <Grid container spacing={5} alignItems="center" justify="flex-end">
                        <Grid item>
                            <input
                                type="text"
                                className="input"
                                placeholder="Search..."
                                value={this.state.term}
                                onChange={this.getSearchResults.bind(this)}
                            />
                        </Grid>
                    </Grid>

                </div>
            </div>
        )
    }
}

export default Topbar;
