import React from "react";
import { Link } from "react-router-dom";
import $ from 'jquery';

class Search extends React.Component {

    constructor(props) {
        super(props);
    }

    render(){
        const { icds } = this.props.SearchState;
        let allIcds = icds.map((icd, index) => {
            return <div key={index} className="col-md-6 col-lg-4">
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">{icd.code}</h5>
                        <h6 className="card-description">{icd.text_de}</h6>
                    </div>
                </div>
            </div>
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

export default Search;