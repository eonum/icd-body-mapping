import React from "react";
import { Link } from "react-router-dom";

/**
 * The Search component doesn't do the searching itself, but it receives an array of
 * IDC's from The home page component and displays them in a viewable fashion.
 * You can access the array through 'this.props.SearchState'
 * This way you can separate the search-bar from it's output.
 * @author Marius Asadauskas
 */
class SearchResults extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            itemSelected: ''
        };
    }

    filter(icd) {
        if (this.state.itemSelected !== ''){
            icd = '';
            this.setState({itemSelected: icd})
        }
        else{
            this.setState({itemSelected: icd})
        }
    }

    /**
     * Render displays all the icds in a viewable fashion and it has an if clause that allows
     * people to select certain icds.
     */
    render(){
        const { icds } = this.props.SearchState;
        let allIcds = icds.map((icd, index) => {
            if (this.state.itemSelected === icd.id || this.state.itemSelected === ''){
                return <div key={index} className="col-md-6 col-lg-4" onClick = {this.filter.bind(this, icd.id)}>
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="card-title">{icd.code}</h5>
                            <h6 className="card-description">{icd.text_de}</h6>
                        </div>
                    </div>
                </div>
            }
        });
        const noIcd = (
            <div className="vw-100 vh-50 d-flex align-items-center justify-content-center">
                <h4>
                    No search results...
                </h4>
            </div>
        );

        return (
            <div>
                <div className="py-5">
                    <main className="container">
                        <div className="row">
                            {icds.length > 0 ? allIcds : noIcd}
                        </div>
                        <Link to="/icds" className="btn btn-link">
                            View all icd's
                        </Link>
                    </main>
                </div>
            </div>
        )
    }
}

export default SearchResults;