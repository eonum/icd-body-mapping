import React from "react";

class NewMaps extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            maps: [],
            icd_id: this.props.icd_id,
            layer_id: this.props.layer_id
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        fetch('/api/v1/maps')
            .then((response) => {return response.json()})
            .then((data) => {this.setState({ maps: data }) });
    }

    handleSubmit() {
        return event =>{
            let body = JSON.stringify({map: {icd_id: this.state.icd_id, layer_id: this.state.layer_id}});
            alert(body);
            fetch('http://localhost:3000/api/v1/maps', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: body,
            }).then((response) => {return response.json()})
                .then((map)=>{this.addNewMap(map)});
            event.preventDefault();
        }
    }
    stateIdSet() {
        this.setState({icd_id: this.props.icd_id, layer_id: this.props.layer_id});
    }

    addNewMap(map){
        this.setState({maps: this.state.maps.concat(map)});
    }

    render() {
        return(
            <form onSubmit={this.handleSubmit()}>
                <input type="submit" value="Submit" onClick={this.stateIdSet.bind(this)}/>
            </form>
        )
    }
}
export default NewMaps