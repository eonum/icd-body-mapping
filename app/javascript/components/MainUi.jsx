import React from 'react';
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import DetailsCard from "./DetailsCard";
import SearchCard from "./SearchCard";
import Mapping from "./Mapping";
import './MainUI.css'
import NewMaps from "./NewMaps";

/**
 * The MainUI collects the child components of which it consists
 * and handles the communication between these components
 * @author Aaron Saegesser
 */
class MainUI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchedIcds: '',
            searchTerm: '',
            buttonTerm: '',
            selectedIcd: '',
            detailsDisplayed: false,
            searchDisplayed: false,
            selectedLayer: '',
            showingIcdId: 0,
            editMode: false,
            checkedIcdIds: [],
			viewAll: false,
            activeLanguage: 'de',
            needUpdate: false
        };
    }

    /** Reset UI
     */

    resetUI = () => {
        this.setState( {
            searchedIcds: '',
            searchTerm: '',
            selectedIcd: '',
            detailsDisplayed: false,
            searchDisplayed: false,
            selectedLayer: 'Ohr',
            showingIcdId: 0,
            editMode: false,
            checkedIcdIds: [],
            viewAll: false,
            activeLanguage: 'de',
        });
        if (this.state.needUpdate === true) {
            this.setState( {
                needUpdate: false
            });

        } else {
            this.setState({
                needUpdate: true
            });
        };
    };

    /**
     * Gets ICD's and searchterm from search in Topbar
     * @params searchedIcdsFromTopbar, searchTermFromTopbar
     */
    callbackTopbarSearch = (searchTermFromTopbar) => {
        this.setState({
            searchTerm: searchTermFromTopbar,
            searchDisplayed: true
        });
    };

    callbackTopbarButtonTerm = (buttonTermFromTopbar) => {
        this.setState({
            buttonTerm: buttonTermFromTopbar
        });
    };

    callbackTopbarEdit = (editable) => {
        this.setState({
            editMode: editable
        });
    };

    callbackTopbarSetLang = (lang) => {
        this.setState({
            activeLanguage: lang
        });
    };

  	callbackViewAll = (viewAll) => {
    		this.setState({
    			   viewAll: viewAll
    		});
  	};

    callbackMapping = (selectedLayerFromMapping) => {
        this.setState({ selectedLayer: selectedLayerFromMapping });
    };

    callbackDetails = (showingIcdIdFromDetails) => {
        this.setState({ showingIcdId: showingIcdIdFromDetails });
    };

    /**
     * Gets selected ICD
     * @params dataFromSidebar
     */
    callbackSidebar = (dataFromSidebar) => {
        this.setState({
            selectedIcd: dataFromSidebar,
            detailsDisplayed: true
        });
    };

    /**
     * Gets selected ICD
     * @params dataFromSearchCard
     */
    callbackSearchCardDetails = (dataFromSearchCard) => {
        this.setState({
            selectedIcd: dataFromSearchCard,
            detailsDisplayed: true
        });
    };

    callbackSearchCardMapping = (checkedIcdIds) => {
        this.setState({
            checkedIcdIds: checkedIcdIds
        });
    };

    callbackSearchCardClose = () => {
        this.setState({
            searchDisplayed: false,
			      viewAll: false
        });
    };

    callbackDetailsCardClose = () => {
        this.setState({
            detailsDisplayed: false
        });
    };

    render() {
        const searchResults = (
            <SearchCard
                searchTerm={this.state.searchTerm}
                buttonTerm={this.state.buttonTerm}
                detailsDisplayed={this.state.detailsDisplayed}
                editable={this.state.editMode}
                selectedLayerId={this.state.selectedLayer.id}
				        viewAll={this.state.viewAll}
                callbackFromMainUIDetails={this.callbackSearchCardDetails}
                callbackFromMainUIMapping={this.callbackSearchCardMapping}
                callbackFromMainUIClose={this.callbackSearchCardClose}
				        callbackFromMainUIViewAll={this.callbackViewAll}
            />
        );
        const details = (
            <DetailsCard
                selectedIcd={this.state.selectedIcd}
                searchDisplayed={this.state.searchDisplayed}
                selectedLayer={this.state.selectedLayer}
                editable={this.state.editMode}
                language={this.state.activeLanguage}
                callbackFromMainUI={this.callbackDetails}
                callbackFromMainUIClose={this.callbackDetailsCardClose}
            />
        );
        const empty = (
            <></>
        );

        const notVisibleStyle = {
            height: '0vh',
        };

        return (
            <div>
                <link rel="shortcut icon" href="./images/favicon.ico"/>
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="w-100">
                            <Topbar
                                editable={this.state.editMode}
								                viewAll={this.state.viewAll}
                                callbackFromMainUISearch={this.callbackTopbarSearch}
                                callbackFromMainUIButton={this.callbackTopbarButtonTerm}
                                callbackFromMainUIEdit={this.callbackTopbarEdit}
								                callbackFromMainUIViewAll={this.callbackViewAll}
                                callbackFromMainUISetLanguage={this.callbackTopbarSetLang}
                                callbackFromMainUIresetUI={this.resetUI}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-2">
                            <Sidebar
                                callbackFromMainUI={this.callbackSidebar}
                                editable={this.state.editMode}
                                needUpdate={this.state.needUpdate}
                            />
                        </div>
                        <div className="col-4">
                            {this.state.detailsDisplayed ? details : empty}
                            {this.state.searchDisplayed ? searchResults : empty}
                        </div>
                        <div className="col-6">
                            <Mapping
                                callbackFromMainUI={this.callbackMapping}
                                showingIcdId={this.state.showingIcdId}
                                needUpdate={this.state.needUpdate}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MainUI;
