import React from 'react';
import $ from "jquery";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import CloseIcon from '@material-ui/icons/Close';
import loadingGif from '../../assets/images/Preloader_2.gif';

/**
 * The MappingList gets the Mappings corresponding to either, chosen Layers
 * or a selected ICD
 * @author Aaron Saegesser, Marius Asadauskas
 */
class LayerList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            layers: [],
            maps: [],
            fragments: [],
            mappedFragments: [],
            checkedFrags: [],
            mouseOver: '',
            showFrags: false,
            load: true,
        };
        this.handleDelete = this.handleDelete.bind(this)
        this.deleteMap = this.deleteMap.bind(this)
    }

    componentDidMount() {
        this.getFragments();
        this.getLayersSorted();
        if (this.props.selectedIcd !== '') {
            this.getMapsOfIcd(this.props.selectedIcd);
        }

        if (this.props.mapView === true) {
            this.setState({showFrags: true});
        }
    }

    componentDidUpdate(prevProps) {
        if(this.props.selectedIcd !== prevProps.selectedIcd) {
            if (this.props.selectedIcd !== '') {
                this.setState({load: true});
                this.getMapsOfIcd(this.props.selectedIcd);
            } else {
                this.setState({maps: []});
            }
            this.setState({checkedFrags: []});
            this.props.callbackFromMainUISelectPngs([]);
        }
        if (this.props.selectedLayer !== prevProps.selectedLayer
          && this.props.selectionFromMapping === true) {
            this.setState({checkedFrags: this.props.selectedLayer});
        }
        if (this.props.updateList !== prevProps.updateList
          && this.props.updateList === true) {
            this.setState({load: true});
            setTimeout(() => {
                this.getMapsOfIcd(this.props.selectedIcd);
            });
            this.setState({checkedFrags: []});
            this.props.callbackFromMainUISelectPngs([]);
            this.props.callbackFromMainUIUpdateListDone();
        }
        if (this.props.showFrags !== prevProps.showFrags) {
            this.setState({showFrags: this.props.showFrags});
        }
        if (this.props.needUpdate !== prevProps.needUpdate) {
            this.setState({
                activeLayer: 'Gehirn Längsschnitt',
                showFrags: true,
                checkedFrags: [],
            });
        }
        if (this.props.mapView !== prevProps.mapView) {
            this.setState({showFrags: (this.props.showFrags
                                      && this.props.mapView)});
        }
        if (this.props.load !== prevProps.load
          && this.props.load === true) {
            this.setState({load: true});
            console.log('bla')
        }
    }

    /**
     * Gets all image fragments from backend
     */
    getFragments() {
      $.getJSON('/api/v1/layers')
          .then(response => this.setState({
              fragments: response
          }));
    }

    /**
     * Gets all layers from backend sorted after ebene
     */
    getLayersSorted() {
      $.getJSON('/api/v1/all/layers')
          .then(response => {
            this.setState({
                layers: response.sort((a, b) => {
                    var layerA = a.ebene.toUpperCase();
                    var layerB = b.ebene.toUpperCase();
                    if (layerA < layerB) {
                        return -1;
                    }
                    if (layerA > layerB) {
                        return 1;
                    }
                    return 0;
                })
            });
            if (this.props.selectedIcd === '') {
              this.setState({load: false});
            }
          })
    }

    /**
     * Gets all mappings of a given icd
     * @param icd
     */
    getMapsOfIcd(icd) {
        $.getJSON('/api/v1/map/' + icd.id)
            .then(response => this.setState({
                maps: response,
                load: false,
            }));
    }

    highlightFragment(fragment) {
        this.props.callbackFromMainUIHighlight(fragment);
        this.setState({mouseOver: fragment});
    }

    setBackToPreviousSelection() {
        this.props.callbackFromMainUIResetToSelection();
        this.setState({mouseOver: ''});
    }

    showFrags(show) {
        if (this.props.showFrags === true) {
            this.setState({showFrags: show});
        };
    }

    /**
     * Selects and unselects elements of the
     * fragment list depending on the boolean add
     * @param frag  fragment to be added/removed
     * @param add   true -> add to selection, false -> remove
     */
    selectFragments(frag, add) {
        let selection = this.state.checkedFrags;

        if (add) {
            selection = selection.concat(frag);
        } else {
            selection = selection.filter((item) => {
                if (item.name !== frag.name) {
                    return item;
                }
            });
        }
        this.setState({
            checkedFrags: selection,
            selectionFromList: true,
        });
        this.props.callbackFromMainUISelectPngs(selection);
    }

    /**
     *
     */
    handleDelete(name){
        let map = this.findMap(name);
        if (map.map_id > 0){
            this.setState({load: true});
            fetch(`http://localhost:3000/api/v1/maps/${map.map_id}`,
                {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json'}
                }).then((response) => {this.deleteMap(map)})
        }
    }

    /**
     *
     */
    findMap(name){
        let maps = this.state.maps
        for (let i = 0; i < maps.length; i++){
            if (maps[i].name === name){
                return maps[i]
            }
        }
    }

    /**
     *
     */
    deleteMap(map){
        let map_id = map.map_id
        let newMaps = this.state.maps.filter((map) => map.map_id !== map_id);
        this.setState({
          maps: newMaps,
          load: false,
        });
        this.props.callbackFromMainUIDeleteMap(map);
    }

    render() {
        // Variables
        const layers = this.state.layers;
        const activeLayer = this.props.activeLayer;
        const maps = this.state.maps;
        let frags = this.state.fragments
        frags = frags.sort((a, b) => {
            var nameA = a.name.toUpperCase();
            var nameB = b.name.toUpperCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        });
        const checkedFrags = this.state.checkedFrags;
        const showFrags = this.state.showFrags;
        const editable = this.props.editable;
        const loading = this.state.load;
        const mouseOver = this.state.mouseOver;
        let mappedFragments = [];
        let checkedFragments = [];
        let mapped = false;
        let showAsSelected = false;
        let mouseOverCurrent = false;

        // Styles
        const style = {
            overflow: 'visible'
        };
        const showHideStyle = {
            position: 'relative',
            zIndex: 20,
            top: '-26px',
            left: '90%',
            width: '10%',
            height: '30px',
        };
        const topStyle = {
            height: '30px',
        };
        const floatRightStyle = {
            float: 'right'
        };
        const bootstrapActiveLayerButton = "btn btn-default p-0 m-0 ml-4 shadow-none font-weight-bold text-primary text-left";
        const bootstrapInactiveLayerButton = "btn btn-default p-0 m-0 ml-4 shadow-none text-left";
        const bootstrapMappedLayer = "list-group-item list-group-item-action p-0 pl-2 pr-2 shadow-none text-primary font-weight-bold";
        const bootstrapUnmappedLayer = "list-group-item list-group-item-action p-0 pl-2 shadow-none";
        const bootstrapMappedLayerEdit = "list-group-item list-group-item-action p-0 pl-2 shadow-none text-primary font-weight-bold bg-light";
        const bootstrapButtonEnabled = "btn btn-default p-0 m-0 shadow-none text-primary";
        const bootstrapButtonDisabled = "btn btn-default p-0 m-0 shadow-none text-secondary";
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

        // Parts
        const loadingImg = (
            <div style={loadingDivStyle}>
                <img src={loadingGif} style={loadingImgStyle}/>
            </div>
        );
        const fragList = frags.map((frag) => {
            mappedFragments = maps.filter((map) => {
                if (frag.name === map.name) {
                    return map;
                }
            });
            checkedFragments = checkedFrags.filter((checkedFrag) => {
                if (frag.name === checkedFrag.name) {
                    return checkedFrag;
                }
            });
            mapped = (mappedFragments.length > 0
              && mappedFragments[0].name === frag.name);
            showAsSelected = ((mapped) ||
                            (checkedFragments.length > 0
                              && checkedFragments[0].name === frag.name));
            mouseOverCurrent = (mouseOver === frag);

            if (frag.ebene === activeLayer) {
                if (editable && !mapped) {
                    return <div
                        type="button"
                        className={showAsSelected ? bootstrapMappedLayerEdit : bootstrapUnmappedLayer}
                        key={frag.id}
                        onClick={this.selectFragments.bind(this, frag, !(showAsSelected))}
                        onMouseEnter={this.highlightFragment.bind(this, frag)}
                        onMouseLeave={this.setBackToPreviousSelection.bind(this)}
                    >
                        {frag.name}
                        {mouseOverCurrent ?
                          <span
                              className="pl-2 pr-2 text-white bg-primary font-weight-normal"
                              style={floatRightStyle}
                          >
                              {showAsSelected ? 'Unselect' : 'Select'}
                          </span>
                          : null}
                    </div>
                } else if (editable && mapped) {
                    return <div
                        type="button"
                        className={showAsSelected ? bootstrapMappedLayerEdit : bootstrapUnmappedLayer}
                        key={frag.id}
                        onClick={() => this.handleDelete(frag.name)}
                        onMouseEnter={this.highlightFragment.bind(this, frag)}
                        onMouseLeave={this.setBackToPreviousSelection.bind(this)}
                    >
                        {frag.name}
                        {mouseOverCurrent ?
                          <span
                              className="pl-2 pr-2 text-white bg-danger font-weight-normal"
                              style={floatRightStyle}
                          >
                              Delete Mapping <CloseIcon />
                          </span>
                          : null}
                    </div>
                } else {
                    return <div
                        className={mapped ? bootstrapMappedLayer : bootstrapUnmappedLayer}
                        key={frag.id}
                        onMouseEnter={this.highlightFragment.bind(this, frag)}
                        onMouseLeave={this.setBackToPreviousSelection.bind(this)}
                    >
                        {frag.name}
                    </div>
                }
            }
        });
        const displayLayerFrags = (
          <div className="list-group d-inline">
                <div className="list-group-item-action mb-1 pl-4 pr-2 border rounded" style={topStyle}>
                    <span className="font-weight-normal align-middle text-secondary">Details: </span>
                    <span className="font-weight-bold align-middle text-primary">{activeLayer}</span>
                    <button
                        type="button"
                        className={(this.props.showFrags === false) ? bootstrapButtonDisabled : bootstrapButtonEnabled}
                        style={floatRightStyle}
                        onClick={this.showFrags.bind(this, !(showFrags))}
                    >
                        {showFrags ? <KeyboardArrowDownIcon/> : <KeyboardArrowLeftIcon/>}
                    </button>
                </div>
                <div className="ml-4">
                    { showFrags ? fragList : null }
                </div>
            </div>
        );

        return (
            <div style={style}>
                {loading ? loadingImg : null}
                {displayLayerFrags}
            </div>
        )
    }
}

export default LayerList;
