import React from 'react';
import $ from "jquery";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';

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
        };
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

    getMapsOfIcd(showedIcd) {
        $.getJSON('/api/v1/map/' + this.props.selectedIcd.id)
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
    }

    setBackToPreviousSelection() {
        this.props.callbackFromMainUIResetToSelection();
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

    render() {
        const layers = this.state.layers;
        const frags = this.state.fragments;
        const activeLayer = this.props.activeLayer;
        const maps = this.state.maps;
        const showFrags = this.state.showFrags;
        const editable = this.props.editable;
        const checkedFrags = this.state.checkedFrags;
        let mappedFragments = [];
        let checkedFragments = [];
        let mapped = false;
        let showAsSelected = false;

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
        const checkboxStyle = {
            float: 'right'
        }
        const bootstrapActiveLayerButton = "btn btn-default p-0 m-0 ml-4 shadow-none font-weight-bold text-primary text-left";
        const bootstrapInactiveLayerButton = "btn btn-default p-0 m-0 ml-4 shadow-none text-left";
        const bootstrapMappedLayer = "list-group-item list-group-item-action p-0 pl-2 pr-2 shadow-none text-primary font-weight-bold";
        const bootstrapUnmappedLayer = "list-group-item list-group-item-action p-0 pl-2 pr-2 shadow-none";
        const bootstrapMappedLayerEdit = "list-group-item list-group-item-action p-0 pl-2 pr-2 shadow-none text-primary font-weight-bold bg-light";

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
                        <div className="ml-4 mr-2 font-weight-bold text-primary text-left">
                            {layer.ebene}
                        </div>
                        <div className="text-left" style={showHideStyle}>
                            {showFrags ? hideButton : showButton}
                        </div>
                    </div>
                    <div className="ml-4">
                        { showFrags ?
                          frags.map((frag, index) => {
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

                            if (frag.ebene === layer.ebene) {
                                if (editable) {
                                    return <div
                                        type="button"
                                        className={showAsSelected ? bootstrapMappedLayerEdit : bootstrapUnmappedLayer}
                                        key={frag.id}
                                        onClick={this.selectFragments.bind(this, frag, !(showAsSelected))}
                                        onMouseEnter={this.highlightFragment.bind(this, frag)}
                                        onMouseLeave={this.setBackToPreviousSelection.bind(this)}
                                    >
                                        {frag.name}
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
