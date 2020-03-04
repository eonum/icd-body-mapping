import React from "react";
import { Link } from "react-router-dom";

class Icds extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            icds: []
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
            .then(response => this.setState({ icds: response }))
            .catch(() => this.props.history.push("/"));
    }

    render() {
        const { icds } = this.state;
        const allIcds = icds.map((icd, index) => (
            <div key={index} className="col-md-6 col-lg-4">
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">{icd.code}</h5>
                        <Link to={`/icds/${icd.id}`} className="btn custom-button">
                            View Icd
                        </Link>
                    </div>
                </div>
            </div>
        ));
        const noIcd = (
            <div className="vw-100 vh-50 d-flex align-items-center justify-content-center">
                <h4>
                   Icd's haven't loaded yet
                </h4>
            </div>
        );

        return (
            <>
                <section className="jumbotron jumbotron-fluid text-center">
                    <div className="container py-5">
                        <h1 className="display-4">A list of all ICD-10 numbers</h1>
                    </div>
                </section>
                <div className="py-5">
                    <main className="container">
                        <div className="row">
                            {icds.length > 0 ? allIcds : noIcd}
                        </div>
                        <Link to="/" className="btn btn-link">
                            Home
                        </Link>
                    </main>
                </div>
            </>
        );
    }
}
export default Icds;