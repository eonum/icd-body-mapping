import React from 'react';
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import DetailsCard from "./DetailsCard";
import SearchCard from "./SearchCard";
import Mapping from "./Mapping";
import LayerList from "./LayerList";
import Logo from "../../assets/images/favicon.ico";

/**
 * The MainUI collects the child components of which it consists
 * and handles the communication between these components
 * @author Aaron Saegesser
 */
class MainUI extends React.Component {
    constructor(props) {
        super(props);
        this.term = '';
        this.state = {
            searchedIcds: '',
            searchTerm: '',
            buttonTerm: '',
            selectedIcd: '',
            map: '',
            detailsDisplayed: false,
            searchDisplayed: false,
            selectedLayer: '',
            showingIcdId: 0,
            editMode: false,
            checkedIcdIds: [],
			      viewAll: false,
            activeLanguage: 'de',
            needUpdate: false,
            hightlightedPng: '',
            selectedLayerFromList: '',
            activeLayer: 'Gehirn Längsschnitt',
            icdSelectionFromSearch: false,
            layerFragmentStack: [],
            addToSelection: false,
            selectionFromMapping: false,
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
        this.term = searchTermFromTopbar;
        this.setState({
            searchTerm: searchTermFromTopbar,
            searchDisplayed: true,
            detailsDisplayed: false,
        });
        if (searchTermFromTopbar === '' || searchTermFromTopbar === null) {
            this.setState({
                searchDisplayed: false,
            });
        }
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

    callbackMapping = (selectedLayerFromMapping, selectionFromMapping) => {
        this.setState({
          selectedLayer: selectedLayerFromMapping,
          selectionFromMapping: selectionFromMapping,
        });
        console.log(selectedLayerFromMapping);
        console.log(selectionFromMapping);
    };

    callbackMappingActiveLayer = (activeLayer) => {
        this.setState({ activeLayer: activeLayer});
    };

    callbackDetails = (showingIcdIdFromDetails) => {
        this.setState({ showingIcdId: showingIcdIdFromDetails });
    };

    callbackDetailsMap = (Map) => {
        this.setState({ map: Map });
    };

    callbackReloadIcds = () => {
        if (this.state.reloadIcds === true) {
          this.setState({ reloadIcds: false});
        } else {
          this.setState({ reloadIcds: true});
        }
    }

    /**
     * Gets selected ICD
     * @params dataFromSidebar
     */
    callbackSidebar = (dataFromSidebar) => {
        this.setState({
            selectedIcd: dataFromSidebar,
            detailsDisplayed: true,
            icdSelectionFromSearch: false,
        });
    };

    /**
     * Gets selected ICD
     * @params dataFromSearchCard
     */
    callbackSearchCardDetails = (dataFromSearchCard) => {
        this.setState({
            selectedIcd: dataFromSearchCard,
            detailsDisplayed: true,
            icdSelectionFromSearch: true,
        });
    };

    callbackSearchCardMapping = (checkedIcdIds) => {
        this.setState({
            checkedIcdIds: checkedIcdIds
        });
    };

    callbackLayerListSelectLayer = (layer) => {
        this.setState({
            selectedLayerFromList: layer,
        });
    };

    callbackLayerListHighlightPng = (fragment) => {
        this.setState({
            hightlightedPng: fragment,
        });
    };

    callbackLayerlistResetSelection = () => {
        this.setState({
            hightlightedPng: '',
        });
    };

    callbackLayerListSelectPngs = (fragments) => {
        this.setState({layerFragmentStack: fragments});
    }

    callbackSearchCardClose = () => {
        this.setState({
            searchDisplayed: false,
			      viewAll: false
        });
    };

    callbackDetailsCardClose = () => {
        this.setState({
            detailsDisplayed: false,
            selectedIcd: '',
        });
    };

    render() {
        const searchResults = (
            <SearchCard
                searchTerm={this.term}
                buttonTerm={this.state.buttonTerm}
                detailsDisplayed={this.state.detailsDisplayed}
                editable={this.state.editMode}
                selectedLayer={this.state.selectedLayer}
				        viewAll={this.state.viewAll}
                language={this.state.activeLanguage}
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
                callbackFromMainUIMaps={this.callbackDetailsMap}
                callbackFromMainUIClose={this.callbackDetailsCardClose}
                callbackFromMainUIReloadIcds={this.callbackReloadIcds}
            />
        );
        const layerList = (
            <LayerList
                callbackFromMainUISelect={this.callbackLayerListSelectLayer}
                callbackFromMainUIHighlight={this.callbackLayerListHighlightPng}
                callbackFromMainUIResetToSelection={this.callbackLayerlistResetSelection}
                callbackFromMainUISelectPngs={this.callbackLayerListSelectPngs}
                activeLayer={this.state.activeLayer}
                selectedIcd={this.state.selectedIcd}
                selectedLayer={this.state.selectedLayer}
                editable={this.state.editMode}
                selectionFromMapping={this.state.selectionFromMapping}
            />
        )

        const empty = (
            <></>
        );

        const notVisibleStyle = {
            height: '0vh',
        };
        const style = {
            height: '86vh',
            overflow: 'auto'
        }

        const sidebarStyle ={
            width: '20%'
        }

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
                                reloadIcds={this.state.reloadIcds}
                                selectedIcd={this.state.selectedIcd}
                                style={sidebarStyle}
                                icdSelectionFromSearch={this.state.icdSelectionFromSearch}
                                language={this.state.activeLanguage}
                            />
                        </div>
                        <div className="col-4" style={style}>
                            {this.state.detailsDisplayed ? details : empty}
                            {this.state.searchDisplayed ? searchResults : empty}
                            {!(this.state.searchDisplayed) ? layerList : empty}
                        </div>
                        <div className="col-6" style={style}>
                            <Mapping
                                callbackFromMainUI={this.callbackMapping}
                                callbackFromMainUIActiveLayer={this.callbackMappingActiveLayer}
                                map={this.state.map}
                                showingIcdId={this.state.showingIcdId}
                                needUpdate={this.state.needUpdate}
                                selectedLayerFromList={this.state.selectedLayerFromList}
                                hightlightedPng={this.state.hightlightedPng}
                                layerFragmentStack={this.state.layerFragmentStack}
                                addToSelection={this.state.addToSelection}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MainUI;
