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
            selectedLayer: '',
            showingIcdId: 0
        };
    }

    /**
     * Gets ICD's and searchterm from search in Topbar
     * @params searchedIcdsFromTopbar, searchTermFromTopbar
     */
    callbackTopbarSearch = (searchedIcdsFromTopbar, searchTermFromTopbar) => {
        this.setState({ searchedIcds: searchedIcdsFromTopbar });
        this.setState({ searchTerm: searchTermFromTopbar});
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
        this.setState({ selectedIcd: dataFromSidebar });
    };

    /**
     * Gets selected ICD
     * @params dataFromSearchCard
     */
    callbackSearchCard = (dataFromSearchCard) => {
        this.setState({ selectedIcd: dataFromSearchCard });
        this.setState({ searchTerm: ''});
    };

    render() {
        let searchResults = (
            <SearchCard
                searchedIcds={this.state.searchedIcds}
                callbackFromMainUI={this.callbackSearchCard}
            />
        );
        let details = (
            <DetailsCard
                selectedIcd={this.state.selectedIcd}
                callbackFromMainUI={this.callbackDetails}
            />
        );

        return (
            <div>
                <link rel="shortcut icon" href="./images/favicon.ico"/>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <Topbar callbackFromMainUI={this.callbackTopbarSearch}/>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <Sidebar callbackFromMainUI={this.callbackSidebar}/>
                        </div>
                        <div className="col-4">
                            <NewMaps icd_id={this.state.selectedIcd.id} layer_id={this.state.selectedLayer}/>
                            {this.state.searchTerm !== '' ? searchResults : details}
                        </div>
                        <div className="col-6">
                            <Mapping callbackFromMainUI={this.callbackMapping} showingIcdId={this.state.showingIcdId}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MainUI;
