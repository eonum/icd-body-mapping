import React from 'react';
import $ from "jquery";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import CloseIcon from '@material-ui/icons/Close';

/**
 * The MappingList gets the Mappings corresponding to either, chosen Layers
 * or a selected ICD
 * @author Aaron Saegesser
 */
class LayerList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            layers: [],
            fragments: [],
            maps: [],
            mappedFragments: [],
            showFrags: true,
            checkedFrags: [],
            change: false,
            mouseOver: '',
        };
        this.handleDelete = this.handleDelete.bind(this)
        this.deleteMap = this.deleteMap.bind(this)
    }

    componentDidMount() {
        $.getJSON('/api/v1/layers')
            .then(response => this.setState({fragments: response}));
        $.getJSON('/api/v1/all/layers')
            .then(response => this.setState({layers: response}));
        if (this.props.selectedIcd !== '') {
            this.getMapsOfIcd(this.props.selectedIcd);
        }
    }

    componentDidUpdate(prevProps) {
        if(this.props.selectedIcd !== prevProps.selectedIcd && this.props.selectedIcd !== '') {
            this.getMapsOfIcd(this.props.selectedIcd);
        }
        if (this.props.selectionFromMapping !== prevProps.selectionFromMapping && this.props.selectionFromMapping === true) {
            this.setState({
                checkedFrags: this.props.selectedLayer,
                change: true,
            });
        }
    }

    getMapsOfIcd(icd) {
        $.getJSON('/api/v1/map/' + icd.id)
            .then(response => this.setState({maps: response}));
    }

    selectLayer(layer) {
        this.props.callbackFromMainUISelect(layer);
        this.setState({
            change: false,
        });
    }

    highlightFragment(fragment) {
        this.props.callbackFromMainUIHighlight(fragment);
        this.setState({
            mouseOver: fragment,
        });
    }

    setBackToPreviousSelection() {
        this.props.callbackFromMainUIResetToSelection();
        this.setState({
            mouseOver: '',
        });
    }

    showFrags(show) {
        this.setState({
            showFrags: show,
        });
    }

    selectFragments(frag, add) {
        let selection = [];
        if (this.state.change === false) {
            selection = this.state.maps;
        } else {
            selection = this.state.checkedFrags;
        }

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
            change: true,
            selectionFromList: true,
        });
        this.props.callbackFromMainUISelectPngs(selection);
    }

    handleDelete(name){
        let map_id = this.findMap(name);
        if (map_id > 0){
            fetch(`http://localhost:3000/api/v1/maps/${map_id}`,
                {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json'}
                }).then((response) => {this.deleteMap(map_id)})
        }
    }

    findMap(name){
        let maps = this.state.maps
        for (let i = 0; i < maps.length; i++){
            if (maps[i].name === name){
                return maps[i].map_id;
            }
        }
    }

    deleteMap(map_id){
        let newMaps = this.state.maps.filter((map) => map.map_id !== map_id);
        this.setState({maps: newMaps});
        this.props.callbackFromMainUIDeleteMap(map_id);
    }

    render() {
        const layers = this.state.layers;
        const frags = this.state.fragments;
        const activeLayer = this.props.activeLayer;
        const maps = this.state.maps;
        const showFrags = this.state.showFrags;
        const editable = this.props.editable;
        const checkedFrags = this.state.checkedFrags;
        let mouseOver = this.state.mouseOver;
        let mappedFragments = [];
        let checkedFragments = [];
        let mapped = false;
        let showAsSelected = false;
        let mouseOverCurrent = false;

        const style = {
            overflow: 'visible'
        }
        const showHideStyle = {
            position: 'relative',
            zIndex: 20,
            top: '-26px',
            left: '90%',
            width: '10%',
            height: '30px',
        }
        const topStyle = {
            height: '30px',
        }
        const floatRightStyle = {
            float: 'right'
        }
        const bootstrapActiveLayerButton = "btn btn-default p-0 m-0 ml-4 shadow-none font-weight-bold text-primary text-left";
        const bootstrapInactiveLayerButton = "btn btn-default p-0 m-0 ml-4 shadow-none text-left";
        const bootstrapMappedLayer = "list-group-item list-group-item-action p-0 pl-2 pr-2 shadow-none text-primary font-weight-bold";
        const bootstrapUnmappedLayer = "list-group-item list-group-item-action p-0 pl-2 shadow-none";
        const bootstrapMappedLayerEdit = "list-group-item list-group-item-action p-0 pl-2 shadow-none text-primary font-weight-bold bg-light";

        const empty = (<></>);


        const showButton = (
          <button
              type="button"
              className="btn btn-default p-0 m-0 shadow-none text-primary"
              onClick={this.showFrags.bind(this, true)}
              title="hide Layers"
          >
              <KeyboardArrowLeftIcon/>
          </button>
        );
        const hideButton = (
          <button
              type="button"
              className="btn btn-default p-0 m-0 shadow-none text-primary"
              onClick={this.showFrags.bind(this, false)}
              title="show Layers"
          >
              <KeyboardArrowDownIcon/>
          </button>
        );
        const displayLayerFrags = layers.map((layer, index) => {
            if (layer.ebene === activeLayer) {
                return <div key={index}>
                    <div className="dropdown list-group-item-action mb-1 border rounded" style={topStyle}>
                        <div className="ml-4 mr-2 text-left">
                            <span className="font-weight-normal text-secondary">Details: </span>
                            <span className="font-weight-bold text-primary">{layer.ebene}</span>
                        </div>
                        <div className="text-left" style={showHideStyle}>
                            {showFrags ? hideButton : showButton}
                        </div>
                    </div>
                    <div className="ml-4">
                        { showFrags ?
                          frags.map((frag) => {
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
                            showAsSelected = ((this.state.change === false && mapped) ||
                                            (checkedFragments.length > 0
                                              && checkedFragments[0].name === frag.name));
                            mouseOverCurrent = (mouseOver === frag);

                            if (frag.ebene === layer.ebene) {
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
                                              {showAsSelected ? 'unselect' : 'select'}
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
                                              delete mapping <CloseIcon />
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
                          }) : empty }
                    </div>
                </div>
            }
        });

        return (
            <div style={style}>
                {displayLayerFrags}
            </div>
        )
    }
}

export default LayerList;
