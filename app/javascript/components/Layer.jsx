import React from "react";

class Layer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            layers: []
        };
        this.handleFormSubmit = this.handleFormSubmit.bind(this);

        this.handleDelete = this.handleDelete.bind(this);
        this.deleteLayer = this.deleteLayer.bind(this);
    }

    componentDidMount() {
        this.setState({layers: this.props.allImages});
    }

    sendIcdToMapping(newImage) {
        this.props.callbackFromMapping(newImage);
    }

    handleFormSubmit(ebene, name, img){
        let body = JSON.stringify({layer: {ebene: ebene, name: name, img: img}});
        fetch('http://localhost:3000/api/v1/layers', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: body,
        }).then((layer)=>{this.addNewLayer(layer)})
    }

    addNewLayer(layer){
        this.sendIcdToMapping(layer);
    }

    handleDelete(id){
        fetch(`http://localhost:3000/api/v1/layers/${id}`,
            {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'}
            }).then((response) => {
            this.deleteLayer(id)
        })
    }

    deleteLayer(id){
        let newLayers = this.state.maps.filter((layer) => layer.id !== id);
        this.setState({layers: newLayers});
    }

    render() {
        let formFields = {};
        let addLayer = (
            <form onSubmit={ (e) => {
                this.handleFormSubmit(formFields.name.value, formFields.ebene.value, formFields.img.value);
                e.preventDefault();
            }}>
                <input ref={input => formFields.ebene = input} placeholder='Enter the name of the item'/>
                <input ref={input => formFields.name = input} placeholder='Enter the name of the image'/>
                <input ref={input => formFields.img = input} placeholder='Enter the image url' />
                <button>Submit</button>
            </form>
        );
        let layers = this.state.layers.map((elem, index) => {
            return(
                <div key={index}>
                    {elem.name}
                    <div onClick={() => this.handleDelete(elem.id)} style={{float: 'right'}}>X</div>
                </div>
            )
        });
        return(
            <div className="btn-group dropleft mr-1">
                <button
                    className="btn btn-default dropdown-toggle text-black"
                    type="button"
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                >
                    settings
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    {addLayer}
                    {layers}
                </div>
            </div>
        );
    }
}
export default Layer