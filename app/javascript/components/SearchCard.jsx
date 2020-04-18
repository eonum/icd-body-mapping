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

    checkAllIcds() {
        var checkAllBox = document.getElementById('checkAll');
        var checkboxes = document.getElementsByName('checkIcd');

        for (var i=0; i<checkboxes.length; i++) {
            checkboxes[i].checked = checkAllBox.checked;
        }
    }

    closeSearchCard() {
        this.props.callbackFromMainUIClose();
    }

    render() {
        const icds = this.props.searchedIcds;
        const detailsVisible = this.props.detailsDisplayed;
        const editable = this.props.editable;

        const searchOnlyStyle = {
            height: '85vh',
            overflow: 'auto'
        }
        const searchNextToDetailsStyle = {
            height: '40vh',
            overflow: 'auto'
        }
        const checkboxStyle = {
            float: 'right'
        }

        const empty = (<></>)
        const checkboxAll = (
            <div className="checkbox mr-3" style={checkboxStyle}>
                <label>
                    select all<input type="checkbox" value="" id="checkAll" onClick={this.checkAllIcds.bind(this)}/>
                </label>
            </div>
        )

        const resultIcds = icds.map((icd, index) => (
            <div key={index} className="card mb-4 mr-1">
                <div className="card-body">
                    {editable ?
                        <div className="checkbox" style={checkboxStyle}>
                            <label>
                                select<input type="checkbox" value="" name="checkIcd" id={icd.code}/>
                            </label>
                        </div>
                        : empty
                    }
                    <h5 className="card-title">{icd.code}</h5>
                    <h6 className="card-description">{icd.text_de}</h6>
                </div>
                <a type="button"
                   className="btn btn-light"
                   onClick={this.selectIcd.bind(this, icd)}>
                    view details
                </a>
            </div>
        ));
        const noIcd = (
            <div className="text-uppercase">no match found...</div>
        );

        return (
            <div>
                <div className="mb-1">
                    <a type="button"
                       className="btn btn-light"
                       onClick={this.closeSearchCard.bind(this)}>
                        <CloseIcon />
                    </a>
                    {editable ? checkboxAll : empty}
                </div>
                <div style={detailsVisible ? searchNextToDetailsStyle : searchOnlyStyle}>
                    {icds.length > 0 ? resultIcds : noIcd}
                </div>
            </div>
        )
    }
}

export default SearchCard;
