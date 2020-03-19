import React from 'react';

/**
 * DetailsCard displays an ICD given via props in a viewable fashion
 * @author Aaron Saegesser
 */
class DetailsCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            icd: []
        };
    }

    componentDidMount() {

    }

    render() {
        let icd = [];

        if (this.props.selectedIcd !== null) {
            icd = this.props.selectedIcd;
        }

        return (
            <div className="card">
                <div className="card-header">
                    <div className="overlay bg-dark" />
                    <h1 className="card-title text-white">
                        {icd.code}
                    </h1>
                </div>
                <div className="card">
                    <h5 className="card-subtitle">German</h5>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: `${icd.text_de}`
                        }}
                    />
                </div>
                <div className="card">
                    <h5 className="card-subtitle">French</h5>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: `${icd.text_fr}`
                        }}
                    />
                </div>
                <div className="card">
                    <h5 className="card-subtitle">Italian</h5>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: `${icd.text_it}`
                        }}
                    />
                </div>
            </div>
        )
    }
}

export default DetailsCard;
