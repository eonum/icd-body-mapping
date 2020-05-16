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

    render() {
        const layers = this.state.layers;
        const frags = this.state.fragments;
        const activeLayer = this.props.activeLayer;
        const maps = this.state.maps;
        const showLayers = this.state.showLayers;
        let mappedFragments = [];

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
        const bootstrapActiveLayerButton = "btn btn-default p-0 m-0 ml-4 shadow-none font-weight-bold text-primary text-left";
        const bootstrapInactiveLayerButton = "btn btn-default p-0 m-0 ml-4 shadow-none text-left";

        const empty = (<></>);


        const dropdownMenu = layers.map((layer, index) => {
            return <div className="dropdown-item" style={dropdownMenuStyle} key={index} onClick={this.selectLayer.bind(this, layer.ebene)}>
                {layer.ebene}
            </div>
        });
        const showButton = (
          <button
              type="button"
              className="btn btn-default p-0 m-0 shadow-none text-primary"
              onClick={this.showLayers.bind(this)}
              title="hide Layers"
          >
              <KeyboardArrowLeftIcon/>
          </button>
        );
        const hideButton = (
          <button
              type="button"
              className="btn btn-default p-0 m-0 shadow-none text-primary"
              onClick={this.showLayers.bind(this)}
              title="show Layers"
          >
              <KeyboardArrowDownIcon/>
          </button>
        );
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
                              <div className="dropdown list-group-item-action mb-1 border rounded">
                                  <button
                                      type="button"
                                      className="btn btn-default p-0 m-0 ml-4 shadow-none font-weight-bold text-primary text-left"
                                      style={dropdownStyle}
                                      id="dropdownMenuButton"
                                      data-toggle="dropdown"
                                      aria-haspopup="true"
                                      aria-expanded="false"
                                      onClick={this.selectLayer.bind(this, layer.ebene)}
                                  >
                                      {layer.ebene}
                                  </button>
                                  <div className="dropdown-menu" style={dropdownMenuStyle} aria-labelledby="dropdownMenuButton">
                                      {dropdownMenu}
                                  </div>
                              </div>
                              <div className="text-left" style={showButtonStyle}>
                                  {hideButton}
                              </div>
                          </div>
                          <ul>
                              { frags.map((frag, index) => {
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
                              }) }
                          </ul>
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
