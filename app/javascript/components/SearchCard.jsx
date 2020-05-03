import React from 'react';
import Button from "@material-ui/core/Button";
import CloseIcon from '@material-ui/icons/Close';
import {Form} from "react-bootstrap";
import NewMaps from "./NewMaps";
import $ from "jquery";

/**
 * SearchCard displays possible search results, but doesn't do the searching itself.
 * It receives an array of ICD's via props.
 * @author Aaron Saegesser
 */
class SearchCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            icds: [],
			checkedIcds: [],
			viewAll: this.props.viewAll,
			term: this.props.searchTerm
        }
    }

	componentDidMount() {
		this.getSearchResults(this.props.searchTerm, this.props.viewAll);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.viewAll !== this.props.viewAll) {
			this.setState({
				viewAll: this.props.viewAll
			});
			this.getSearchResults(this.props.searchTerm, this.props.viewAll);
		}
		if (prevProps.searchTerm !== this.props.searchTerm) {
			this.setState({
				term: this.props.searchTerm
			});
			this.getSearchResults(this.props.searchTerm, this.props.viewAll);
		}
	}

	/**
     * Gets the search results from the link '/search?q=' + this.state.term
     * and saves them into the icds array, this will be later passed on to the search results component
     * via callbackFromMainUI function
     */
    getSearchResults(term, viewAll) {
		if (viewAll) {
			$.getJSON('/api/v1/searchAll?q=' + term)
				.then(async response =>
					this.setState({
						term: term,
						icds: await response
					})
				);
		} else {
			$.getJSON('/api/v1/search?q=' + term)
				.then(async response =>
					this.setState({
						term: term,
						icds: await response
					})
				);
		}
    }

	viewAllSearchResults() {
		this.setState({
			viewAll: true
		});
		this.getSearchResults(this.state.term, true);
		this.props.callbackFromMainUIViewAll(true);
	}

    selectIcd(icd) {
        this.props.callbackFromMainUIDetails(icd);
    }

    checkAllIcds() {
        let i;
        let checkAllBox = document.getElementById('checkAll');
        let checkboxes = document.getElementsByName('checkIcd');
        let selection = [];

        for (i = 0; i<checkboxes.length; i++) {
            checkboxes[i].checked = checkAllBox.checked;
            if (checkboxes[i].checked === true) {
                selection.push(parseInt(checkboxes[i].id, 10));
            }
        }

        this.setState({
            checkedIcds: selection
        });

        this.props.callbackFromMainUIMapping(selection);
    }

    checkSelectedIcd(icdId) {
        let checkbox = document.getElementById(icdId);
        let selection = this.state.checkedIcds;

        if (checkbox.checked === true) {
            selection.push(icdId);
        } else {
            for (let i=0; i<selection.length; i++) {
                if (selection[i] === icdId) {
                    selection.splice(i, 1);
                }
            }
        }
        this.setState({
            checkedIcds: selection
        });

        if (this.state.checkedIcds.length > 0) {
            this.props.callbackFromMainUIMapping(selection);
        }
    }

    closeSearchCard() {
        this.props.callbackFromMainUIClose();
    }

    render() {
        const icds = this.state.icds;
        const detailsVisible = this.props.detailsDisplayed;
        const editable = this.props.editable;
        const selection = this.state.checkedIcds;
        const layer_id = this.props.selectedLayerId;
		const viewAll = this.state.viewAll;

        const searchOnlyStyle = {
            height: '82vh',
            overflow: 'auto'
        }
        const searchNextToDetailsStyle = {
            height: '46vh',
            overflow: 'auto'
        }
        const checkboxStyle = {
            float: 'right'
        }
		const viewAllButtonStyle = {
			float: 'center'
		}

        const empty = (<></>)
        const checkboxAll = (
            <div className="checkbox mr-4 mt-2" style={checkboxStyle}>
                <label>
                    select all<input type="checkbox"
                                     value="" id="checkAll"
                                     onClick={this.checkAllIcds.bind(this)}/>
                </label>
            </div>
        );
        const mapButton = (
            <NewMaps
                icd_id={undefined}
                icd_ids={selection}
                layer_id={layer_id}
            />
        );
        const resultIcds = icds.map((icd, index) => (
            <div key={index} className="card mb-4 mr-1">
                <div className="card-body">
                    {editable ?
                        <div className="checkbox" style={checkboxStyle}>
                            <label>
                                select<input type="checkbox"
                                             value="" name="checkIcd"
                                             id={icd.id}
                                             onClick={this.checkSelectedIcd.bind(this, icd.id)}/>
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
		const viewAllButton = (
			<button type="button"
			   className="btn btn-default text-primary"
			   style={viewAllButtonStyle}
			   onClick={this.viewAllSearchResults.bind(this)}>
				view all
			</button>
		)

        return (
            <div>
                <div className="row mb-1">
                    <div className="col-2">
                        <button type="button"
                                className="btn btn-default"
                                onClick={this.closeSearchCard.bind(this)}>
                            <CloseIcon />
                        </button>
                    </div>
                    <div className="col-6">
                        {editable ? mapButton : empty}
                    </div>
                    <div className="col-4">
                        {editable ? checkboxAll : empty}
                    </div>
                </div>
                <div style={detailsVisible ? searchNextToDetailsStyle : searchOnlyStyle}>
                    {icds.length > 0 ? resultIcds : noIcd}
					<div className="text-center">
						{(viewAll || icds.length < 20) ? empty : viewAllButton}
					</div>
                </div>
            </div>
        )
    }
}

export default SearchCard;
