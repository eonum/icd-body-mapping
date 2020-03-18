import React from 'react';

/**
 * SearchCard displays possible search results, but doesn't do the searching itself.
 * It receives an array of ICD's via props.
 * @author Aaron Saegesser
 */
class SearchCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemSelected: ''
        }
    }

    selectIcd(icd) {
        this.props.callbackFromMainUI(icd);
    }

    render() {
        const icds = this.props.searchedIcds;
        const allIcds = icds.map((icd, index) => (
            <div key={index} className="card mb-4" onClick={this.selectIcd.bind(this, icd)}>
                <div className="card-body">
                    <h5 className="card-title">{icd.code}</h5>
                    <h6 className="card-description">{icd.text_de}</h6>
                </div>
            </div>
        ));
        const noIcd = (
            <div className="text-uppercase">no match found...</div>
        );

        return (
            <div>
                {icds.length > 0 ? allIcds : noIcd}
            </div>
        )
    }
}

export default SearchCard;
