import React from 'react';
import $ from "jquery";
import { Navbar, Nav, Form, FormControl, Button } from "react-bootstrap";
import * as Icon from 'react-bootstrap-icons';
import logo from '../../assets/images/eonum_logo.png';
import SearchIcon from '@material-ui/icons/Search';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

/**
 * The Topbar contains the searchbar and header and is responsible for the searching.
 * Possible search results are handed over to parent via callback.
 * @author Aaron Saegesser
 */
class Topbar extends React.Component {
    searchText;
    constructor(props) {
        super(props);
        this.state = {
            query: '',
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
     * and saves them into the icds array, this will be later passed on to the search results component
     * via callbackFromMainUI function
     */
    getAutoCompleteResults(e) {
        this.setState({
            term: e.target.value
        }, () => {
            $.getJSON('/search?q=' + this.state.term)
                .then(async response =>
                    this.props.callbackFromMainUI(await response, this.state.term)
                )
        });
    }

    getSearchResults() {
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
                this.props.callbackFromMainUISearch(await response, this.state.term)
            );
    }

    setEditMode(edit) {
        this.props.callbackFromMainUIEdit(edit);
    }

    render() {
        const headerStyle = {
            fontSize: '24px'
        }

        const editButton = (
            <button type="button" className="btn btn-default" onClick={this.setEditMode.bind(this, true)}>
                <svg className="bi bi-pencil" width="1em" height="1em" viewBox="0 0 16 16" fill="white"
                     xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd"
                          d="M11.293 1.293a1 1 0 011.414 0l2 2a1 1 0 010 1.414l-9 9a1 1 0 01-.39.242l-3 1a1 1 0 01-1.266-1.265l1-3a1 1 0 01.242-.391l9-9zM12 2l2 2-9 9-3 1 1-3 9-9z"
                          clipRule="evenodd"/>
                    <path fillRule="evenodd"
                          d="M12.146 6.354l-2.5-2.5.708-.708 2.5 2.5-.707.708zM3 10v.5a.5.5 0 00.5.5H4v.5a.5.5 0 00.5.5H5v.5a.5.5 0 00.5.5H6v-1.5a.5.5 0 00-.5-.5H5v-.5a.5.5 0 00-.5-.5H3z"
                          clipRule="evenodd"/>
                </svg>
            </button>
        )
        const exitEditButton = (
            <button
                type="button"
                className="btn btn-default text-white ml-2"
                onClick={this.setEditMode.bind(this, false)}
            >
                <ExitToAppIcon/>
            </button>
        )

        return (
            <div className="navbar navbar-expand-md navbar-light bg-primary">
                <Form>
                    <FormControl
                        onChange={event => {this.setState({term: event.target.value})}}
                        onKeyDown={event => {if (event.key === 'Enter') {this.getSearchResults()}}}
                        type="text"
                        placeholder="Search..."
                        className="mr-sm-2"
                    />
                </Form>
                <button
                    type="button"
                    className="btn btn-default text-white ml-2"
                    onClick={event => {if (this.state.term !== '') {this.getSearchResults()}}}
                >
                    <SearchIcon/>
                </button>
                <h1 className="navbar-brand mx-auto text-white" style={headerStyle}>
                    ICD Mapping -
                    <img className="ml-2" src={logo} alt="eonum" height="16px" />
                </h1>
                {this.props.editable ? exitEditButton : editButton}
            </div>
        )
    }
}

export default Topbar;