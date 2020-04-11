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

    render() {
        let icd = [];

        if (this.props.selectedIcd !== null) {
            icd = this.props.selectedIcd;
        }

        return (
            <div className="card">
                <div className="card-header bg-primary">
                    <div className="overlay bg-primary" />
                    <h1 className="card-title text-white">
                        {icd.code}
                    </h1>
                </div>
                <div className="card m-2 mt-4 mr-4 ml-4 border-0">
                    <h5 className="card-subtitle">German</h5>
                    <div
                        className="border-top"
                        dangerouslySetInnerHTML={{
                            __html: `${icd.text_de}`
                        }}
                    />
                </div>
                <div className="card m-2 mr-4 ml-4 border-0">
                    <h5 className="card-subtitle">French</h5>
                    <div
                        className="border-top"
                        dangerouslySetInnerHTML={{
                            __html: `${icd.text_fr}`
                        }}
                    />
                </div>
                <div className="card mt-2 ml-4 mr-4 mb-3 border-0">
                    <h5 className="card-subtitle">Italian</h5>
                    <div
                        className="border-top"
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
