import React from 'react';
import $ from "jquery";
import { Navbar, Nav, Form, FormControl, Button } from "react-bootstrap";
import * as Icon from 'react-bootstrap-icons';



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
            <div className="navbar navbar-expand-md navbar-light bg-primary">
                <Form className="navbar-form navbar-left">
                <FormControl
                    value={this.state.term}
                    onChange={this.getAutoCompleteResults.bind(this)}
                    type="text"
                    placeholder="Search"
                    className="mr-sm-2"


                />
                </Form>
                <a className="navbar-brand mx-auto" href="#">ICD Mapping -
                    <img src="../../assets/images/eonum_logo.png" alt="eonum" />
                </a>
                <button type="button" className="btn btn-default" >
                    <svg className="bi bi-pencil" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor"
                         xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd"
                              d="M11.293 1.293a1 1 0 011.414 0l2 2a1 1 0 010 1.414l-9 9a1 1 0 01-.39.242l-3 1a1 1 0 01-1.266-1.265l1-3a1 1 0 01.242-.391l9-9zM12 2l2 2-9 9-3 1 1-3 9-9z"
                              clipRule="evenodd"/>
                        <path fillRule="evenodd"
                              d="M12.146 6.354l-2.5-2.5.708-.708 2.5 2.5-.707.708zM3 10v.5a.5.5 0 00.5.5H4v.5a.5.5 0 00.5.5H5v.5a.5.5 0 00.5.5H6v-1.5a.5.5 0 00-.5-.5H5v-.5a.5.5 0 00-.5-.5H3z"
                              clipRule="evenodd"/>
                    </svg>
                </button>
            </div>
        )
    }
}

export default Topbar;
