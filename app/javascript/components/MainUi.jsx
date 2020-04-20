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
            selectedIcd: '',
            detailsDisplayed: false,
            searchDisplayed: false,
            selectedLayer: '',
            showingIcdId: 0,
            editMode: false
        };
    }

    /**
     * Gets ICD's and searchterm from search in Topbar
     * @params searchedIcdsFromTopbar, searchTermFromTopbar
     */
    callbackTopbarSearch = (searchedIcdsFromTopbar, searchTermFromTopbar) => {
        this.setState({
            searchedIcds: searchedIcdsFromTopbar,
            searchTerm: searchTermFromTopbar,
            searchDisplayed: true
        });
    };

    callbackTopbarEdit = (editable) => {
        this.setState({
            editMode: editable
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
            //searchTerm: ''
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

    callbackSearchCardMapping = (checkedIcds) => {
        this.setState({
            checkedIcds: checkedIcds
        });
    };

    callbackSearchCardClose = () => {
        this.setState({
            searchDisplayed: false
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
                searchedIcds={this.state.searchedIcds}
                detailsDisplayed={this.state.detailsDisplayed}
                editable={this.state.editMode}
                callbackFromMainUIDetails={this.callbackSearchCardDetails}
                callbackFromMainUIMapping={this.callbackSearchCardMapping}
                callbackFromMainUIClose={this.callbackSearchCardClose}
            />
        );
        const details = (
            <DetailsCard
                selectedIcd={this.state.selectedIcd}
                searchDisplayed={this.state.searchDisplayed}
                callbackFromMainUI={this.callbackDetails}
                callbackFromMainUIClose={this.callbackDetailsCardClose}
                selectedLayer={this.state.selectedLayer}
                editable={this.state.editMode}
            />
        );
        const newMaps = (
            <NewMaps
                icd_id={this.state.selectedIcd.id}
                layer_id={this.state.selectedLayer.id}
            />
        )
        const empty = (
            <></>
        )

        const visibleStyle = {
            height: '41vh',
            overflow: 'auto',
            marginBottom: '2vh'
        }
        const notVisibleStyle = {
            height: '0vh',
        }

        return (
            <div>
                <link rel="shortcut icon" href="./images/favicon.ico"/>
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-12">
                            <Topbar
                                editable={this.state.editMode}
                                callbackFromMainUISearch={this.callbackTopbarSearch}
                                callbackFromMainUIEdit={this.callbackTopbarEdit}
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
                            {this.state.editMode ? newMaps : empty}
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
