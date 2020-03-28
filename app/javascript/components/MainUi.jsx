import React from 'react';
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import DetailsCard from "./DetailsCard";
import SearchCard from "./SearchCard";
import Mapping from "./Mapping";
import './MainUI.css'

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
            selectedIcd: ''
        };
    }

    componentDidMount() {

    }

    /**
     * Gets ICD's and searchterm from search in Topbar
     * @params searchedIcdsFromTopbar, searchTermFromTopbar
     */
    callbackTopbarSearch = (searchedIcdsFromTopbar, searchTermFromTopbar) => {
        this.setState({ searchedIcds: searchedIcdsFromTopbar });
        this.setState({ searchTerm: searchTermFromTopbar});
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
        const searchResults = (
            <SearchCard
                searchedIcds={this.state.searchedIcds}
                callbackFromMainUI={this.callbackSearchCard}
            />
        );
        const details = (
            <DetailsCard selectedIcd={this.state.selectedIcd}/>
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
                            {this.state.searchTerm !== '' ? searchResults : details}
                        </div>
                        <div className="col-6">
                            <Mapping />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MainUI;
