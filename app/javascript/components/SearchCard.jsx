import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import NewMaps from "./NewMaps";
import $ from "jquery";
import loadingGif from '../../assets/images/Preloader_2.gif';

/**
 * SearchCard displays possible search results, and does the searching.
 * It receives the searchterm from Topbar via MainUI
 * @author Aaron Saegesser
 */
class SearchCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            icds: [],
            checkedIcds: [],
            viewAll: this.props.viewAll,
            term: this.props.searchTerm,
            checkedAll: false,
            load: false,
        }
    }

    componentDidMount() {
        this.setState({load: true});
        this.getSearchResults(this.props.searchTerm, this.props.viewAll);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.viewAll !== this.props.viewAll) {
            this.setState({viewAll: this.props.viewAll});
            if (this.props.viewAll === true) {
                this.setState({load: true});
            }
            this.getSearchResults(this.props.searchTerm, this.props.viewAll);
        }
        if (prevProps.searchTerm !== this.props.searchTerm) {
            this.setState({
                term: this.props.searchTerm,
                load: true,
            });
            this.getSearchResults(this.props.searchTerm, this.props.viewAll);
        }
    }

    callbackNewMapsLoading = (loading) => {
        this.setState({load: loading});
    };

    /**
     * Gets the search results from the link '/search?q=' + this.state.term
     * and saves them into the icds array, this will be later passed on to the search results component
     * via callbackFromMainUI function
     */
    getSearchResults = async (term, viewAll) => {
        if (viewAll) {
            $.getJSON('/api/v1/searchAll_' + this.props.language + '?q=' + await term)
                .then(async response =>
                    this.setState({
                        icds: await response,
                        term: term,
                        load: false,
                    })
                );
        } else if (!viewAll) {
            $.getJSON('/api/v1/search_' + this.props.language + '?q=' + term)
                .then(async response =>
                    this.setState({
                        icds: await response,
                        term: term,
                        load: false,
                    })
                );
        }
    }

    /**
     * Gets all
     */
    viewAllSearchResults() {
        this.setState({
            viewAll: true,
            load: true,
        });
        this.getSearchResults(this.state.term, true);
        this.props.callbackFromMainUIViewAll(true);
    }

    viewIcd(icd) {
        this.props.callbackFromMainUIDetails(icd);
    }

    /**
     * Checks all displayed Icds and sends the selection to MainUI
     */
    checkAllIcds() {
        let i;
        let checkboxes = document.getElementsByName('checkIcd');
        let selection = [];

        if (this.state.checkedAll === false) {
            for (i = 0; i < checkboxes.length; i++) {
                checkboxes[i].checked = true;
                if (checkboxes[i].checked === true) {
                    selection.push(parseInt(checkboxes[i].id, 10));
                }
            }
            this.setState({checkedAll: true});
        } else {
            for (i = 0; i < checkboxes.length; i++) {
                checkboxes[i].checked = false;
            }
            this.setState({checkedAll: false});
        }

        this.setState({checkedIcds: selection});

        this.props.callbackFromMainUIMapping(selection);
    }

    /**
     * Checks a given Icd and sends it to MainUI
     * @param icdId   ID of the Icd to be selected
     */
    checkSelectedIcd(icdId) {
        let checkbox = document.getElementById(icdId);
        let selection = this.state.checkedIcds;

        if (checkbox.checked === true) {
            selection.push(icdId);
        } else {
            for (let i = 0; i < selection.length; i++) {
                if (selection[i] === icdId) {
                    selection.splice(i, 1);
                }
            }
        }
        this.setState({checkedIcds: selection});

        if (this.state.checkedIcds.length > 0) {
            this.props.callbackFromMainUIMapping(selection);
        }
    }

    closeSearchCard() {
        this.props.callbackFromMainUIClose();
    }

    render() {
        // Variables
        const icds = this.state.icds;
        const detailsVisible = this.props.detailsDisplayed;
        const editable = this.props.editable;
        const selection = this.state.checkedIcds;
        const selectedLayer = this.props.selectedLayer;
        const viewAll = this.state.viewAll;
        const lang = this.props.language;
        const loading = this.state.load;

        // Styles
        const searchOnlyStyle = {
            height: '78vh',
            overflow: 'auto'
        };
        const searchNextToDetailsStyle = {
            height: '44vh',
            overflow: 'auto'
        };
        const checkboxStyle = {
            float: 'right'
        };
        const viewAllButtonStyle = {
            float: 'center'
        };
        const closeButtonStyle = {
            float: 'right'
        };
        const cardBorder = "border-top border-primary";
        const cardNoBorder = "";
        const loadingImgStyle = {
            zIndex: 100,
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '50px',
            height: '50px',
            marginTop: '-25px',
            marginLeft: '-25px',
        };
        const loadingDivStyle = {
            zIndex: 99,
            top: '0%',
            left: '0%',
            height: '100%',
            width: '100%',
            position: 'absolute',
            backgroundColor: 'rgba(255,255,255,0.7)',
        };

        // Component Parts
        const loadingImg = (
            <div style={loadingDivStyle}>
                <img src={loadingGif} style={loadingImgStyle}/>
            </div>
        );
        const checkAllButton = (
            <button
                type="button"
                className="btn btn-outline-primary"
                onClick={this.checkAllIcds.bind(this)}
            >
                Select All
            </button>
        );
        const mapButton = (
            <NewMaps
                icd_id={undefined}
                icd_ids={selection}
                selectedLayer={selectedLayer}
                callbackFromDetailsCard={this.props.callbackFromMainUIMaps}
                callbackFromSearchCard={this.callbackNewMapsLoading}
                parent={'search'}
            />
        );
        const viewAllButton = (
            <button type="button"
                    className="btn btn-default text-primary"
                    style={viewAllButtonStyle}
                    onClick={this.viewAllSearchResults.bind(this)}
            >
                View All
            </button>
        );
        const closeButton = (
            <button type="button"
                    className="btn btn-default mr-2 text-primary"
                    style={closeButtonStyle}
                    onClick={this.closeSearchCard.bind(this)}>
                <CloseIcon/>
            </button>
        );
        const noIcd = (
            <div className="text-uppercase">no match found...</div>
        );
        const resultIcds = icds.map((icd, index) => (
            <div key={index} className="card mb-4 mr-1">
                <div className="card-body pb-2">
                    {editable ?
                        <div className="checkbox" style={checkboxStyle}>
                            <label>
                                select<input type="checkbox"
                                             value="" name="checkIcd"
                                             id={icd.id}
                                             onClick={this.checkSelectedIcd.bind(this, icd.id)}/>
                            </label>
                        </div>
                        : null
                    }
                    <h5 className="card-title text-primary m-0">{icd.code}</h5>
                    {lang === 'de' ? <h6 className="card-description">{icd.text_de}</h6> : null}
                    {lang === 'fr' ? <h6 className="card-description">{icd.text_fr}</h6> : null}
                    {lang === 'it' ? <h6 className="card-description">{icd.text_it}</h6> : null}
                </div>
                <a type="button"
                   className="btn btn-light text-primary"
                   onClick={this.viewIcd.bind(this, icd)}>
                    View Details
                </a>
            </div>
        ));

        return (
            <div className={detailsVisible ? cardBorder : cardNoBorder}>
                <div className="row mt-2 mb-1">
                    <div className="col-4">
                        {editable ? checkAllButton : null}
                    </div>
                    <div className="col-4 text-center">
                        {(editable && selectedLayer !== undefined) ? mapButton : null}
                    </div>
                    <div className="col-4 text-right">
                        {closeButton}
                    </div>
                </div>
                <div style={detailsVisible ? searchNextToDetailsStyle : searchOnlyStyle}>
                    {loading ? loadingImg : null}
                    {icds.length > 0 ? resultIcds : noIcd}
                    <div className="text-center">
                        {(viewAll || icds.length < 20) ? null : viewAllButton}
                    </div>
                </div>
            </div>
        )
    }
}

export default SearchCard;
