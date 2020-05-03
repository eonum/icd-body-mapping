import React from 'react';

/**
 * The MappingList gets the Mappings corresponding to either, chosen Layers
 * or a selected ICD
 * @author Aaron Saegesser
 */
class LayerList extends React.Component {
    constructor(props) {
        super(props);
        this.allICDs = [];
        this.chapterICDs = [];
        this.state = {
            layers: [],
            fragments: [],
            mappedFragments: [],
        };
    }

    componentDidMount() {
        const url = "/api/v1/layers";
        fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response wasn't ok.");
            })
            .then(async response => this.storeDatabase(await response));
    }

    componentDidUpdate(prevProps) {

    }

    /**
     * Takes backend response and calls methods to store the DB
     * in the frontend for further processing
     * @param layerFrags
     */
     storeDatabase(layers) {
         this.setState({
             layers: layers
         })

         let frags = [];
         for (var i=0; i<layers.length; i++) {
             const url = "/api/v1/layers/" + this.layers.ebene;
             fetch(url)
                 .then(response => {
                     if (response.ok) {
                         return response.json();
                     }
                     throw new Error("Network response wasn't ok.");
                 })
                 .then(async response => {frags.push(await response)})
                 .catch(() => this.props.history.push("/"));
         }
         this.setState({
              fragments: frags,
         });
     }



    render() {
        const layers = this.state.layers;
        const frags = this.state.fragments;

        const empty = (<></>)
        let showFrags;
        const showLayers = layers.map((layers, index) => (
            <li key={index} className="list-item">{layers.name}</li>

        ));

        return (
            <div>
                <ul className="list-group">
                    {layers.length > 0 ? showLayers : empty}
                </ul>
            </div>
        )
    }
}

export default LayerList;
