import React from "react";

/**
 * The NewMaps component is one, which is responsible for creating connections between the icd codes
 * and the images. It does this by creating an entry inside the maps table, which contains an
 * the icd_id, layer_id coloms.
 * It gets the layer_id and icd_id as props from the DetailsCard, which in turn them from the MainUi$
 * @author Marius Asadauskas
 */
class NewMaps extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            maps: [],
            icd_id: '',
            icd_ids: [],
            selectedLayer: [],
            buttonColor: 'btn btn-primary'
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate(prevProps) {
        if(this.props.icd_id !== prevProps.icd_id) {
            this.setState({buttonColor: 'btn btn-primary'});
        }
    }

    sendIcdToDetailsCard(newMap) {
        this.props.callbackFromDetailsCard(newMap);
    }

    /**
     * The handle submit method is called, once a user clicks on submit
     * it calls the backend with the Method Post and then passes the intended object,
     * which should be posted.
     * event.preventDefault(); is needed as to not reload the site every time.
     */
    handleSubmit(multiMapping, event) {
        let icd_ids = [];
        let layers = this.state.selectedLayer;

        if (multiMapping) {
            icd_ids = this.props.icd_ids;
        } else {
            icd_ids = icd_ids.concat(this.props.icd_id);
        }
        for (let i=0; i<icd_ids.length; i++) {
            for (let lay=0; lay < layers.length; lay++) {
                let body = JSON.stringify({map: {icd_id: icd_ids[i], layer_id: layers[lay].id}});
                fetch('http://localhost:3000/api/v1/maps', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: body,
                }).then((map)=>{this.addNewMap(map)});
            }
        }
        this.sendIcdToDetailsCard(this.state.maps);
        this.setState({maps: []});
        event.preventDefault();
    }

    addNewMap(map){
        this.setState({maps: this.state.maps.concat(map)});
    }

    /**
     * This Method receives the props from the main ui and the sets them into the state of newMaps
     */
    stateIdSet() {
        this.setState({
            icd_id: this.props.icd_id,
            icd_ids: this.props.icd_ids,
            selectedLayer: this.props.selectedLayer,
            buttonColor: 'btn btn-success'
        });
        this.props.callbackFromMainUIUpdateList();
    }

    render() {
        let icd_id = this.props.icd_id;
        let selectedLayer = this.props.selectedLayer;
        let icd_ids = this.props.icd_ids;
        const parent = this.props.parent;
        let inSearch = (parent === 'search');
        return(
            <form
                onSubmit={this.handleSubmit.bind(this, inSearch)}
                className={inSearch ? "text-center" : "text-right"}
            >
                <input type="submit"
                       className={this.state.buttonColor}
                       value={inSearch ? "Map Selected" : "Save"}
                       onClick={this.stateIdSet.bind(this)}
                />
            </form>
        );
    }
}
export default NewMaps
