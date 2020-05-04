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
        $.getJSON('/api/v1/all/layers')
            .then(response => this.setState({fragments: response}));
        $.getJSON('/api/v1/layers')
            .then(response => this.setState({layers: response}));
        $.getJSON('/api/v1/maps')
            .then(response => this.setState({maps: response}));
    }

    selectLayer(layer) {
        this.props.callbackFromMainUISelect(layer);
    }

    highlightFragment(fragment) {
        this.props.callbackFromMainUIHighlight(fragment);
    }

    render() {
        const layers = this.state.layers;
        const frags = this.state.fragments;
        const activeLayer = this.props.activeLayer;

        const style = {
            height: '86vh',
            overflow: 'auto'
        }

        const empty = (<></>);
        let showFrags;
        const show = layers.map((layer, index) => {
            return <div key={layer.id}>{layer.ebene}</div>
        });

        const showLayers = layers.map((layer, index) => {
          if (layer.ebene === activeLayer) {
              return <div>
                          <button
                              type="button"
                              className="list-group-item list-group-item-action font-weight-bold text-primary"
                              key={index}
                              onClick={this.selectLayer.bind(this, layer.ebene)}
                          >
                              {layer.ebene}
                          </button>
                          <ul>
                              {frags.map((frag, index) => {
                                  if (frag.ebene === layer.ebene) {
                                      return <li
                                                  type="button"
                                                  className="list-group-item list-group-item-action"
                                                  key={frag.id}
                                                  onMouseMove={this.highlightFragment.bind(this, frag)}
                                              >
                                                  {frag.name}
                                              </li>
                                  }
                              })}
                          </ul>
                      </div>
          } else {
              return <div>
                          <button
                              type="button"
                              className="list-group-item list-group-item-action font-weight-bold"
                              key={index}
                              onClick={this.selectLayer.bind(this, layer.ebene)}
                          >
                              {layer.ebene}
                          </button>
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
