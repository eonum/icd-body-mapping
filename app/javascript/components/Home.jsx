import React from "react";
import SearchResults from "../components/SearchResults";
import $ from "jquery";
import { Link } from "react-router-dom";


/**
 * The home component is our main component to which you get linked by default
 */
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            term: '',
            icds: []
        };

        $.getJSON('/search?q=' + this.state.term)
            .then(response => this.setState({ icds: response }))
    }

    /**
     * Gets the search results from the link '/search?q=' + this.state.term
     * and saves them into the icds array, this will be later passed on to the search results component
     */
    getAutoCompleteResults(e){
        this.setState({
            term: e.target.value
        }, () => {
            $.getJSON('/search?q=' + this.state.term)
                .then(response => this.setState({ icds: response }))
        });
    }

    /**
     * Link is responsible for the tab icon
     * input is the search-bar, which gets the Icds from the backend through '/search?q='
     * SearchResults is passed an array of Icds as to display them, see ./SearchResults.jsx
     * @returns {The home Page render}
     */
    render() {
        return (
            <div>
                <link rel="shortcut icon" href="./images/favicon.ico"/>
                <div className="jumbotron jumbotron-fluid bg-transparent">
                    <div className="container secondary-color">
                        <h1 className="display-4">ICD-Body-Mapping</h1>
                        <p className="lead">
                            A curated list of ICD-10 Numbers.
                        </p>
                        <Link to={`/MainUI`}>Home</Link>
                        <hr className="my-4" />
                        <input ref={ (input) => { this.searchBar = input } }
                               value={ this.state.term }
                               onChange={ this.getAutoCompleteResults.bind(this) }
                               type='text' placeholder='Search...' />
                        <SearchResults SearchState={this.state}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
