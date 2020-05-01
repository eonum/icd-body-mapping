import React from 'react';
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import DetailsCard from "./DetailsCard";
import SearchCard from "./SearchCard";
import Mapping from "./Mapping";
import './MainUI.css'
import Logo from "../../assets/images/favicon.ico";
import AllMaps from "./AllMaps";

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
            selectedIcd: '',
            detailsDisplayed: false,
            searchDisplayed: false,
            selectedLayer: '',
            showingIcdId: 0,
            editMode: false,
            checkedIcdIds: [],
			viewAll: false,
            activeLanguage: 'de'
        };
    }

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
        let searchResults = (
            <SearchCard
                searchTerm={this.state.searchTerm}
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
        let details = (
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
        let allMaps = (
            <AllMaps
                showingIcdId={this.state.showingIcdId}
            />
        );
        const empty = (
            <div/>
        );

        return (
            <div>
                <link rel="shortcut icon" href={Logo}/>
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="w-100">
                            <Topbar
                                editable={this.state.editMode}
								viewAll={this.state.viewAll}
                                callbackFromMainUISearch={this.callbackTopbarSearch}
                                callbackFromMainUIEdit={this.callbackTopbarEdit}
								callbackFromMainUIViewAll={this.callbackViewAll}
                                callbackFromMainUISetLanguage={this.callbackTopbarSetLang}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-2">
                            <Sidebar
                                callbackFromMainUI={this.callbackSidebar}
                                editable={this.state.editMode}
                            />
                        </div>
                        <div className="col-4">
                            {this.state.detailsDisplayed ? details : empty}
                            {allMaps}
                            {this.state.searchDisplayed ? searchResults : empty}
                        </div>
                        <div className="col-6">
                            <Mapping
                                callbackFromMainUI={this.callbackMapping}
                                showingIcdId={this.state.showingIcdId}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MainUI;
