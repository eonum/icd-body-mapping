import React from "react";

class NewMaps extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            maps: [],
            selectedIcd: '',
            selectedLayer: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        fetch('/api/v1/maps')
            .then((response) => {return response.json()})
            .then((data) => {this.setState({ maps: data }) });
    }

    handleSubmit(event) {
            let body = JSON.stringify({map: {icd_id: this.state.selectedIcd, layer_id: this.state.selectedLayer}});
            fetch('http://localhost:3000/api/v1/maps', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: body,
            }).then((response) => {return response.json()})
                .then((map)=>{this.addNewMap(map)});
            alert(body);
            event.preventDefault();
    }

    setIdStates(){
        this.setState({selectedLayer: this.props.selectedLayer});
        this.setState({selectedIcd: this.props.selectedIcd});
    }

    addNewMap(map){
        this.setState({maps: this.state.maps.concat(map)});
    }

    render() {
        return(
            <form onSubmit={this.handleSubmit}>
                <input type="submit" value="Submit" onClick={this.setIdStates}/>
            </form>
        )
    }
}
export default NewMaps