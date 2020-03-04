import React from "react";
import { Link } from "react-router-dom";

class Icd extends React.Component {
    constructor(props) {
        super(props);
        this.state = { icd: { text_de: "" } };
        this.state = { icd: { text_fr: "" } };
        this.state = { icd: { text_it: "" } };

        this.addHtmlEntities = this.addHtmlEntities.bind(this);
    }

    componentDidMount() {
        const {
            match: {
                params: { id }
            }
        } = this.props;

        const url = `/icds/${id}`;

        fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response wasn't ok.");
            })
            .then(response => this.setState({ icd: response }))
            .catch(() => this.props.history.push("/icds"));
    }

    addHtmlEntities(str) {
        return String(str)
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">");
    }

    render() {
        const { icd } = this.state;

        return (
            <div>
                <div className="hero position-relative d-flex align-items-center justify-content-center">
                    <div className="overlay bg-dark position-absolute" />
                    <h1 className="display-4 position-relative text-white">
                        {icd.code}
                    </h1>
                </div>
                <div className="row">
                    <div className="col-sm-8 col-lg-4">
                        <h5>German</h5>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: `${icd.text_de}`
                            }}
                        />
                    </div>
                    <div className="col-sm-8 col-lg-4">
                        <h5>French</h5>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: `${icd.text_fr}`
                            }}
                        />
                    </div>
                    <div className="col-sm-8 col-lg-4">
                        <h5>Italian</h5>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: `${icd.text_it}`
                            }}
                        />
                    </div>
                </div>
                <Link to="/icds" className="btn btn-link">
                    Back to other numbers
                </Link>
            </div>
        );
    }
}

export default Icd;