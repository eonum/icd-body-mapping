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
 * @author Aaron Saegesser, Joshua Felder
 */
class MainUI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeLanguage: 'de',
            activeLayer: 'Gehirn Längsschnitt',
            searchTerm: '',
            buttonTerm: '',
            searchedIcds: '',
            selectedIcd: '',
            updatedIcd: '',
            showingIcdId: 0,
            checkedIcdIds: [],
            selectedLayer: '',
            selectedLayerFromList: '',
            map: '',
            mapLayerList: 0,
            hightlightedPng: '',
            layerFragmentStack: [],
            needUpdate: false,
            icdSelectionFromSearch: false,
            addToSelection: false,
            selectionFromMapping: false,
            updateList: false,
            detailsDisplayed: false,
            searchDisplayed: false,
            editMode: false,
            viewAll: false,
            showFrags: true,
            mapView: true,
        };
    }

    /**
     * Reset UI via Home Button
     */
    resetUI = () => {
        this.setState({
            activeLayer: 'Gehirn Längsschnitt',
            searchTerm: '',
            buttonTerm: '',
            searchedIcds: '',
            selectedIcd: '',
            updatedIcd: '',
            showingIcdId: 0,
            checkedIcdIds: [],
            selectedLayer: '',
            selectedLayerFromList: '',
            map: '',
            mapLayerList: 0,
            hightlightedPng: '',
            layerFragmentStack: [],
            detailsDisplayed: false,
            searchDisplayed: false,
            editMode: false,
            viewAll: false,
            icdSelectionFromSearch: false,
            addToSelection: false,
            selectionFromMapping: false,
            updateList: false,
            showFrags: true,
            mapView: true,
        });
        if (this.state.needUpdate === true) {
            this.setState({needUpdate: false});
        } else {
            this.setState({needUpdate: true});
        }
    };

    /**
     * The following callbackmethods are needed for communication of
     * child components to either another childcomponent or to the parentcomponent
     * MainUI, after callback the name of the childcomponent using this callback
     * is indicated and at last the purpose of the callback
     *
     * NOTE: the changes of the state variables can affect multiple other components
     * via props
     */
    callbackTopbarSearch = (searchTermFromTopbar) => {
        this.setState({
            searchTerm: searchTermFromTopbar,
            searchDisplayed: true,
            detailsDisplayed: false,
        });
        if (searchTermFromTopbar === '' || searchTermFromTopbar === null) {
            this.setState({searchDisplayed: false});
        }
    };

    callbackTopbarButtonTerm = (buttonTermFromTopbar) => {
        this.setState({buttonTerm: buttonTermFromTopbar});
    };

    callbackTopbarEdit = (editable) => {
        this.setState({editMode: editable});
    };

    callbackTopbarSetLang = (lang) => {
        this.setState({activeLanguage: lang});
    };

    callbackSidebarSelectIcd = (dataFromSidebar) => {
        this.setState({
            selectedIcd: dataFromSidebar,
            detailsDisplayed: true,
            icdSelectionFromSearch: false,
        });
    };

    callbackLayerListHighlightPng = (fragment) => {
        this.setState({hightlightedPng: fragment});
    };

    callbackLayerlistResetToSelection = () => {
        this.setState({hightlightedPng: ''});
    };

    callbackLayerListSelectPngs = (fragments) => {
        this.setState({layerFragmentStack: fragments});
    }

    callbackLayerListDeleteMap = (map) => {
        this.setState({mapLayerList: map});
    }

    callbackLayerListUpdateListDone = () => {
        this.setState({updateList: false});
    };

    callbackDetailsIcdIdForMapping = (showingIcdIdFromDetails) => {
        this.setState({showingIcdId: showingIcdIdFromDetails});
    };

    callbackDetailsMap = (Map) => {
        this.setState({map: Map});
    };

    callbackDetailsReloadIcds = () => {
        if (this.state.reloadIcds === true) {
            this.setState({reloadIcds: false});
        } else {
            this.setState({reloadIcds: true});
        }
    }

    callbackDetailsUpdatedAnnotations = (icd) => {
        this.setState({updatedIcd: icd});
    }

    callbackDetailsUpdateList = () => {
        this.setState({updateList: true});
    };

    callbackDetailsCardClose = () => {
        this.setState({
            detailsDisplayed: false,
            selectedIcd: '',
        });
    };

    callbackSearchCardDetails = (dataFromSearchCard) => {
        this.setState({
            selectedIcd: dataFromSearchCard,
            detailsDisplayed: true,
            icdSelectionFromSearch: true,
        });
    };

    callbackSearchCardMapping = (checkedIcdIds) => {
        this.setState({checkedIcdIds: checkedIcdIds});
    };

    callbackSearchCardClose = () => {
        this.setState({
            searchDisplayed: false,
            viewAll: false,
        });
    };

    callbackMappingSelection = (selectedLayerFromMapping, selectionFromMapping) => {
        this.setState({
            selectedLayer: selectedLayerFromMapping,
            selectionFromMapping: selectionFromMapping,
        });
    };

    callbackMappingActiveLayer = (activeLayer) => {
        this.setState({activeLayer: activeLayer});
    };

    callbackMappingMinimizeLayerList = (minimize) => {
        this.setState({
            showFrags: !minimize,
            mapView: !minimize,
        });
    };

    callbackViewAll = (viewAll) => {
        this.setState({viewAll: viewAll});
    };

    render() {
        const style = {
            height: '86vh',
            overflow: 'auto'
        };
        const sidebarStyle = {
            width: '20%'
        };

        const topbar = (
            <Topbar
                editable={this.state.editMode}
                viewAll={this.state.viewAll}
                searchDisplayed={this.state.searchDisplayed}
                callbackFromMainUISearch={this.callbackTopbarSearch}
                callbackFromMainUIButton={this.callbackTopbarButtonTerm}
                callbackFromMainUIEdit={this.callbackTopbarEdit}
                callbackFromMainUIViewAll={this.callbackViewAll}
                callbackFromMainUISetLanguage={this.callbackTopbarSetLang}
                callbackFromMainUIresetUI={this.resetUI}
            />
        );
        const sidebar = (
            <Sidebar
                style={sidebarStyle}
                editable={this.state.editMode}
                needUpdate={this.state.needUpdate}
                reloadIcds={this.state.reloadIcds}
                selectedIcd={this.state.selectedIcd}
                icdSelectionFromSearch={this.state.icdSelectionFromSearch}
                language={this.state.activeLanguage}
                updatedIcd={this.state.updatedIcd}
                callbackFromMainUI={this.callbackSidebarSelectIcd}
            />
        );
        const layerList = (
            <LayerList
                needUpdate={this.state.needUpdate}
                activeLayer={this.state.activeLayer}
                selectedIcd={this.state.selectedIcd}
                selectedLayer={this.state.selectedLayer}
                editable={this.state.editMode}
                selectionFromMapping={this.state.selectionFromMapping}
                updateList={this.state.updateList}
                showFrags={this.state.showFrags}
                mapView={this.state.mapView}
                callbackFromMainUIHighlight={this.callbackLayerListHighlightPng}
                callbackFromMainUIResetToSelection={this.callbackLayerlistResetToSelection}
                callbackFromMainUISelectPngs={this.callbackLayerListSelectPngs}
                callbackFromMainUIDeleteMap={this.callbackLayerListDeleteMap}
                callbackFromMainUIUpdateListDone={this.callbackLayerListUpdateListDone}
            />
        );
        const details = (
            <DetailsCard
                selectedIcd={this.state.selectedIcd}
                searchDisplayed={this.state.searchDisplayed}
                selectedLayer={this.state.selectedLayer}
                editable={this.state.editMode}
                language={this.state.activeLanguage}
                callbackFromMainUIAnnotations={this.callbackDetailsUpdatedAnnotations}
                callbackFromMainUIIcdIdForMapping={this.callbackDetailsIcdIdForMapping}
                callbackFromMainUIMaps={this.callbackDetailsMap}
                callbackFromMainUIClose={this.callbackDetailsCardClose}
                callbackFromMainUIReloadIcds={this.callbackDetailsReloadIcds}
                callbackFromMainUIUpdateList={this.callbackDetailsUpdateList}
            />
        );
        const searchResults = (
            <SearchCard
                searchTerm={this.state.searchTerm}
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
                callbackFromMainUIMaps={this.callbackDetailsMap}
            />
        );
        const mapping = (
            <Mapping
                map={this.state.map}
                mapLayerList={this.state.mapLayerList}
                showingIcdId={this.state.showingIcdId}
                needUpdate={this.state.needUpdate}
                selectedLayerFromList={this.state.selectedLayerFromList}
                hightlightedPng={this.state.hightlightedPng}
                layerFragmentStack={this.state.layerFragmentStack}
                addToSelection={this.state.addToSelection}
                selectedIcd={this.state.selectedIcd}
                checkedIcdIds={this.state.checkedIcdIds}
                editable={this.state.editMode}
                callbackFromMainUISelection={this.callbackMappingSelection}
                callbackFromMainUIActiveLayer={this.callbackMappingActiveLayer}
                callbackFromMainUIMinimizeLayerList={this.callbackMappingMinimizeLayerList}
            />
        );

        return (
            <div>
                <link rel="shortcut icon" href={Logo}/>
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="w-100">
                            {topbar}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-2">
                            {sidebar}
                        </div>
                        <div className="col-4" style={style}>
                            {this.state.detailsDisplayed ? details : null}
                            {this.state.searchDisplayed ? searchResults : null}
                            {!(this.state.searchDisplayed) ? layerList : null}
                        </div>
                        <div className="col-6" style={style}>
                            {mapping}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MainUI;
