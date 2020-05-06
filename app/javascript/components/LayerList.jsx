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
        };
    }

    componentDidMount() {
        $.getJSON('/api/v1/all/layers')
            .then(response => this.setState({fragments: response}));
        $.getJSON('/api/v1/layers')
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

    showHideLayerfragments() {
        if (this.state.showFrags === true) {
            this.setState({
                showFrags: false,
            });
        } else {
            this.setState({
                showFrags: true,
            });
        }
    }

    render() {
        const layers = this.state.layers;
        const frags = this.state.fragments;
        const activeLayer = this.props.activeLayer;
        const maps = this.state.maps;
        const showFrags = this.state.showFrags;
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
        const showHideStyle = {
            position: 'relative',
            zIndex: 20,
            top: '-34px',
            left: '90%',
            width: '10%',
            height: '30px',
        }
        const topStyleShow = {
            height: '35px',
        }
        const topStyleHide = {
            overflow: 'visible',
            height: 'auto'
        }

        const empty = (<></>);
        const show = layers.map((layer, index) => {
            return <div key={layer.id}>{layer.ebene}</div>
        });


        const dropdownMenu = layers.map((layer, index) => {
            return <div className="dropdown-item" style={dropdownMenuStyle} key={index} onClick={this.selectLayer.bind(this, layer.ebene)}>
                {layer.ebene}
            </div>
        });
        const showButton = (
          <button
              type="button"
              className="btn btn-default p-0 m-0 shadow-none text-primary"
              onClick={this.showHideLayerfragments.bind(this)}
          >
              <KeyboardArrowLeftIcon/>
          </button>
        );
        const hideButton = (
          <button
              type="button"
              className="btn btn-default p-0 m-0 shadow-none text-primary"
              onClick={this.showHideLayerfragments.bind(this)}
          >
              <KeyboardArrowDownIcon/>
          </button>
        );
        const showLayers = layers.map((layer, index) => {
            if (layer.ebene === activeLayer) {
                return <div key={index}>
                          <div style={showFrags ? topStyleShow : topStyleHide} className="">
                              <div className="dropdown list-group-item-action mb-1 border rounded">
                                  <button
                                      type="button"
                                      className="btn btn-default p-0 m-0 ml-4 shadow-none font-weight-bold text-primary text-left"
                                      style={dropdownStyle}
                                      id="dropdownMenuButton"
                                      data-toggle="dropdown"
                                      aria-haspopup="true"
                                      aria-expanded="false"
                                      key={index}
                                      onClick={this.selectLayer.bind(this, layer.ebene)}
                                  >
                                      {layer.ebene}
                                  </button>
                                  <div className="dropdown-menu" style={dropdownMenuStyle} aria-labelledby="dropdownMenuButton">
                                      {dropdownMenu}
                                  </div>
                              </div>
                              <div className="text-left" style={showHideStyle}>
                                  {showFrags ? hideButton : showButton}
                              </div>
                          </div>
                        <ul>
                            { showFrags ?
                              frags.map((frag, index) => {
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
                            })
                          : empty }
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
