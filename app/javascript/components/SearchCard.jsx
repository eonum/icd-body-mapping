import React from 'react';
import Button from "@material-ui/core/Button";
import CloseIcon from '@material-ui/icons/Close';

/**
 * SearchCard displays possible search results, but doesn't do the searching itself.
 * It receives an array of ICD's via props.
 * @author Aaron Saegesser
 */
class SearchCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemSelected: '',
        }
    }

    selectIcd(icd) {
        this.props.callbackFromMainUI(icd);
    }

    closeSearchCard() {
        this.props.callbackFromMainUIClose();
    }

    render() {
        const icds = this.props.searchedIcds;
        const detailsVisible = this.props.detailsDisplayed;

        const searchOnlyStyle = {
            height: '85vh',
            overflow: 'auto'
        }
        const searchNextToDetailsStyle = {
            height: '40vh',
            overflow: 'auto'
        }

        const allIcds = icds.map((icd, index) => (
            <div key={index} className="card mb-4 mr-1">
                <div className="card-body">
                    <h5 className="card-title">{icd.code}</h5>
                    <h6 className="card-description">{icd.text_de}</h6>
                </div>
                <a type="button" className="btn btn-light" onClick={this.selectIcd.bind(this, icd)}>view details</a>
            </div>
        ));
        const noIcd = (
            <div className="text-uppercase">no match found...</div>
        );

        return (
            <div>
                <div>
                    <a type="button" className="btn btn-light" onClick={this.closeSearchCard.bind(this)}>
                        <CloseIcon />
                    </a>
                </div>
                <div style={detailsVisible ? searchNextToDetailsStyle : searchOnlyStyle}>
                    {icds.length > 0 ? allIcds : noIcd}
                </div>
            </div>
        )
    }
}

export default SearchCard;
