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
            selectedIcd: '',
            detailsDisplayed: false,
            searchDisplayed: false
        };
    }

    componentDidMount() {

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
    callbackSearchCard = (dataFromSearchCard) => {
        this.setState({
            selectedIcd: dataFromSearchCard,
            detailsDisplayed: true
        });
        //this.setState({ searchTerm: ''});
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
                callbackFromMainUI={this.callbackSearchCard}
                callbackFromMainUIClose={this.callbackSearchCardClose}
            />
        );
        const details = (
            <DetailsCard
                selectedIcd={this.state.selectedIcd}
                callbackFromMainUIClose={this.callbackDetailsCardClose}
            />
        );
        const empty = (
            <></>
        )

        const visibleStyle = {
            height: '45vh',
            overflow: 'auto'
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
                            <Topbar callbackFromMainUI={this.callbackTopbarSearch}/>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <Sidebar callbackFromMainUI={this.callbackSidebar}/>
                        </div>
                        <div className="col-4">
                            <div style={this.state.detailsDisplayed ? visibleStyle : notVisibleStyle} className="mb-2">
                                {this.state.detailsDisplayed ? details : empty}
                            </div>
                            {this.state.searchDisplayed ? searchResults : empty}
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
