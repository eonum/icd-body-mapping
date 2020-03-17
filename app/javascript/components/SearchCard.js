import React from 'react';

class SearchCard extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        const icds = this.props.searchedIcds;
        const allIcds = icds.map((icd, index) => (
            <div key={index} className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">{icd.code}</h5>
                    <h6 className="card-description">{icd.text_de}</h6>
                </div>
            </div>
        ));
        const noIcd = (
            <div className="text-uppercase">catalogue loading...</div>
        );

        return (
            <div>
                {icds.length > 0 ? allIcds : noIcd}
            </div>
        )
    }
}

export default SearchCard;
