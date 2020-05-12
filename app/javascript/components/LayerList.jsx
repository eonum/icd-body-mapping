import React from 'react';
import $ from "jquery";

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
    }

    highlightFragment(fragment) {
        this.props.callbackFromMainUIHighlight(fragment);
    }

    setBackToPreviousSelection() {
        this.props.callbackFromMainUIResetToSelection();
    }

    render() {
        const layers = this.state.layers;
        const frags = this.state.fragments;
        const activeLayer = this.props.activeLayer;
        const maps = this.state.maps;
        let mappedFragments = [];

        const style = {
            overflow: 'auto'
        }

        const empty = (<div/>);
        let showFrags;
        const show = layers.map((layer, index) => {
            return <div key={layer.id}>{layer.ebene}</div>
        });

        const dropdownMenu = layers.map((layer, index) => {
            return <div className="dropdown-item" key={index} onClick={this.selectLayer.bind(this, layer.ebene)}>
                {layer.ebene}
            </div>
        });

        const showLayers = layers.map((layer, index) => {
            if (layer.ebene === activeLayer) {
                return <div key={index}>
                            <button
                                type="button"
                                className="list-group-item list-group-item-action p-0 font-weight-bold text-primary"
                                id="dropdownMenuButton"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                                key={index}
                                onClick={this.selectLayer.bind(this, layer.ebene)}
                            >
                                {layer.ebene}
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                {dropdownMenu}
                            </div>
                            <ul>
                                {frags.map((frag, index) => {
                                    mappedFragments = maps.filter((map) => {
                                        if (frag.name === map.name) {
                                            return map;
                                        }
                                    });

                                    if (frag.ebene === layer.ebene) {
                                        if (mappedFragments.length > 0 && mappedFragments[0].name === frag.name) {
                                            return <li
                                                        type="button"
                                                        className="list-group-item list-group-item-action p-0 text-primary font-weight-bold"
                                                        key={frag.id}
                                                        onMouseEnter={this.highlightFragment.bind(this, frag)}
                                                        onMouseLeave={this.setBackToPreviousSelection.bind(this)}
                                                    >
                                                        {frag.name}
                                                    </li>
                                        } else {
                                            return <li
                                                        type="button"
                                                        className="list-group-item list-group-item-action p-0"
                                                        key={frag.id}
                                                        onMouseEnter={this.highlightFragment.bind(this, frag)}
                                                        onMouseLeave={this.setBackToPreviousSelection.bind(this)}
                                                    >
                                                        {frag.name}
                                                    </li>
                                        }
                                    }
                                })}
                            </ul>
                        </div>
            }
        });

        return (
            <div style={style}>
                {layers.length > 0 ? showLayers : empty}
            </div>
        )
    }
}

export default LayerList;
