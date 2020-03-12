import React from "react";
import { Link } from "react-router-dom";
import Search from "../components/Search";
import $ from "jquery";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            term: '',
            icds: [],
            itemSelected: {},
            showItemSelected: false
        };

        $.getJSON('/search?q=' + this.state.term)
            .then(response => this.setState({ icds: response }))
    }

    getAutoCompleteResults(e){
        this.setState({
            term: e.target.value
        }, () => {
            $.getJSON('/search?q=' + this.state.term)
                .then(response => this.setState({ icds: response }))
        });
    }

    render() {
        return (
            <div>
                <div className="jumbotron jumbotron-fluid bg-transparent">
                    <div className="container secondary-color">
                        <h1 className="display-4">ICD-Body-Mapping</h1>
                        <p className="lead">
                            A curated list of ICD-10 Numbers.
                        </p>
                        <hr className="my-4" />
                        <input ref={ (input) => { this.searchBar = input } }
                               value={ this.state.term }
                               onChange={ this.getAutoCompleteResults.bind(this) }
                               type='text' placeholder='Search...' />
                        <Search SearchState={this.state}/>
                    </div>
                </div>
            </div>
        );
    }
}
export default Home;