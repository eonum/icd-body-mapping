import React from "react";

/**
 * The NewMaps component is one, which is responsible for creating connections between the icd codes
 * and the images. It does this by creating an entry inside the maps table, which contains an
 * the icd_id, layer_id collums.
 * It gets the layer_id and icd_id as props from the DetailsCard, which in turn them from the MainUi$
 * @author Marius Asadauskas
 */
class NewMaps extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            maps: [],
            icd_id: '',
            layer_id: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * This method makes sure to get all the existing maps from the maps table
     * and saves them into the maps array. This is later needed, as to add new maps.
     */
    componentDidMount(){
        fetch('/api/v1/maps')
            .then((response) => {return response.json()})
            .then((data) => {this.setState({ maps: data }) });
    }

    /**
     * The handle submit method is called, once a user clicks on submit
     * it calls the backend with the Method Post and then passes the intended object,
     * which should be posted.
     * event.preventDefault(); is needed as to not reload the site every time.
     */
    handleSubmit(event) {
        let body = JSON.stringify({map: {icd_id: this.state.icd_id, layer_id: this.state.layer_id}});
        fetch('http://localhost:3000/api/v1/maps', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: body,
        }).then((response) => {return response.json()})
            .then((map)=>{this.addNewMap(map)});
        event.preventDefault();
    }

    /**
     * This Method receives the props from the main ui and the sets them into the state of newMaps.
     */
    stateIdSet() {
        this.setState({icd_id: this.props.icd_id, layer_id: this.props.layer_id});
    }

    /**
     * A method, which purpose is to concat a new map onto the existing maps array
     * @param map is an object, which contains the icd_id and layer_id
     */
    addNewMap(map){
        this.setState({maps: this.state.maps.concat(map)});
    }

    render() {
        let icd_id = this.props.icd_id;
        let layer_id = this.props.layer_id;

        if (icd_id === '' || layer_id === ''){
            return(
                <div/>
            );
        } else {
            return(
                <form onSubmit={this.handleSubmit}>
                    <input type="submit" value={icd_id + ' + ' + layer_id} onClick={this.stateIdSet.bind(this)}/>
                </form>
            );
        }
    }
}
export default NewMaps