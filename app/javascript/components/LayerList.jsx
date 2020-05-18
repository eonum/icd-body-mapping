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
            showLayers: false,
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
    }

    getMapsOfIcd(showedIcd) {
        $.getJSON('/api/v1/map/' + this.props.selectedIcd.id)
            .then(response => this.setState({maps: response}));
    }

    selectLayer(layer) {
        this.props.callbackFromMainUISelect(layer);
        this.setState({
            showLayers: false,
            change: false,
        });
    }

    highlightFragment(fragment) {
        this.props.callbackFromMainUIHighlight(fragment);
    }

    setBackToPreviousSelection() {
        this.props.callbackFromMainUIResetToSelection();
    }

    showLayers() {
        this.setState({
            showLayers: true,
        });
    }

    selectFragments(frag, add) {
        let selection
        if (this.state.change === false) {
            selection = this.state.maps;
        } else {
            selection = this.state.checkedFrags;
        }

        if (add) {
            selection.push(frag);
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
        });

        if (this.state.checkedFrags.length > 0) {
            this.props.callbackFromMainUISelectPngs(selection);
        }
    }

    render() {
        const layers = this.state.layers;
        const frags = this.state.fragments;
        const activeLayer = this.props.activeLayer;
        const maps = this.state.maps;
        const showLayers = this.state.showLayers;
        const editable = this.props.editable;
        const checkedFrags = this.state.checkedFrags;
        let mappedFragments = [];
        let checkedFragments = [];
        let mapped = false;

        const style = {
            overflow: 'visible'
        }
        const dropdownStyle = {
            width: '90%',
            height: '30px',
        }
        const dropdownMenuStyle = {
            postion: 'relative',
            overflow: 'visible',
            zIndex: 100,
        }
        const showButtonStyle = {
            position: 'relative',
            zIndex: 20,
            top: '-34px',
            left: '90%',
            width: '10%',
            height: '30px',
        }
        const hideButtonStyle = {
            position: 'relative',
            zIndex: 20,
            top: '-29px',
            left: '90%',
            width: '10%',
            height: '30px',
        }
        const topStyleLayer = {
            height: '29px',
        }
        const topStyleFrags = {
            height: '35px',
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


        const dropdownMenu = layers.map((layer, index) => {
            return <div className="dropdown-item" style={dropdownMenuStyle} key={index} onClick={this.selectLayer.bind(this, layer.ebene)}>
                {layer.ebene}
            </div>
        });
        const displayLayers = layers.map((layer, index) => {
            return <div key={index} style={topStyleLayer} className="list-group-item-action border rounded">
                <button
                    type="button"
                    className={(layer.ebene === activeLayer) ? bootstrapActiveLayerButton : bootstrapInactiveLayerButton}
                    onClick={this.selectLayer.bind(this, layer.ebene)}
                >
                    {layer.ebene}
                </button>
                <div style={hideButtonStyle}>
                    <button
                        type="button"
                        className="btn btn-default p-0 m-0 mr-4 shadow-none text-primary"
                        onClick={this.selectLayer.bind(this, layer.ebene)}
                        title="hide Layers"
                    >
                        <KeyboardArrowLeftIcon/>
                    </button>
                </div>
            </div>
        });
        const displayLayerFrags = layers.map((layer, index) => {
            if (layer.ebene === activeLayer) {
                return <div key={index}>
                    <div style={topStyleFrags}>
                        <div className="dropdown list-group-item-action mb-1 border rounded" >
                            <div
                                type="button"
                                className="btn btn-default p-0 m-0 ml-4 shadow-none font-weight-bold text-primary text-left"
                            >
                                {layer.ebene}
                            </div>
                            <button
                                type="button"
                                id="dropdownMenuButton"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                                className="btn btn-default p-0 m-0 shadow-none text-primary"
                                onClick={this.selectLayer.bind(this, layer.ebene)}
                                title="select Layers"
                            >
                                <KeyboardArrowDownIcon/>
                            </button>
                            <div className="dropdown-menu" style={dropdownMenuStyle} aria-labelledby="dropdownMenuButton">
                                {dropdownMenu}
                            </div>
                        </div>
                    </div>
                    <div className="ml-4">
                        { frags.map((frag, index) => {
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

                            if (frag.ebene === layer.ebene) {
                                if (editable) {
                                    if (this.state.change === false && mapped) {
                                        return <div
                                            type="button"
                                            className={bootstrapMappedLayerEdit}
                                            selected
                                            key={frag.id}
                                            onClick={this.selectFragments.bind(this, frag, false)}
                                            onMouseEnter={this.highlightFragment.bind(this, frag)}
                                            onMouseLeave={this.setBackToPreviousSelection.bind(this)}
                                        >
                                            {frag.name}
                                        </div>
                                    } else if (checkedFragments.length > 0
                                                && checkedFragments[0].name === frag.name) {
                                        return <div
                                            type="button"
                                            className={bootstrapMappedLayerEdit}
                                            selected
                                            key={frag.id}
                                            onClick={this.selectFragments.bind(this, frag, false)}
                                            onMouseEnter={this.highlightFragment.bind(this, frag)}
                                            onMouseLeave={this.setBackToPreviousSelection.bind(this)}
                                        >
                                            {frag.name}
                                        </div>
                                    } else {
                                        return <div
                                            type="button"
                                            className={bootstrapUnmappedLayer}
                                            selected
                                            key={frag.id}
                                            onClick={this.selectFragments.bind(this, frag, true)}
                                            onMouseEnter={this.highlightFragment.bind(this, frag)}
                                            onMouseLeave={this.setBackToPreviousSelection.bind(this)}
                                        >
                                            {frag.name}
                                        </div>
                                    }
                                } else {
                                    return <div
                                        type="button"
                                        className={mapped ? bootstrapMappedLayer : bootstrapUnmappedLayer}
                                        key={frag.id}
                                        onMouseEnter={this.highlightFragment.bind(this, frag)}
                                        onMouseLeave={this.setBackToPreviousSelection.bind(this)}
                                    >
                                        {frag.name}
                                    </div>
                                }
                            }
                        }) }
                    </div>
                </div>
            }
        });

        return (
            <div style={style}>
                {showLayers ? displayLayers : displayLayerFrags}
            </div>
        )
    }
}

export default LayerList;
