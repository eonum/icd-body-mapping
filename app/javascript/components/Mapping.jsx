import React from 'react';
import $ from "jquery";

/**
 * The Mapping component is one that displays the individual layers,
 * so that the user can see them and interact with them.
 * It allows the user to choose between the Layers with a dropdown Menu,
 * It also registers clicks from a user and checks which image was chosen in the selectPng Method.
 * @author Marius Asadauskas
 */
class Mapping extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageElements: [],
            layers: [],
            x: 0, y: 0,
            selectedId: 0,
            activeLayer: 'Layers'
        };

        $.getJSON('/layers/Ohr')
            .then(response => this.setState({imageElements: response}));

        $.getJSON('/layers')
            .then(response => this.setState({layers: response}));
    }

    /**
     * A method, which sends the chosen image back to the Main Ui, so that other components,
     * like the details card can access it.
     * @param bild holds the layer_id of an image
     */
    sendIcdToMainUI(bild) {
        this.props.callbackFromMainUI(bild);
    }

    /**
     * The _onMouseMove Method tracks the mouse movements of a User
     * within the details card. This is needed later on in the selectPng,
     * as to know at which coordinates a click happens.
     */
    _onMouseMove(e) {
        this.setState({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY});
    }

    /**
     * Once a layer is selected, the Program gets all it's images from the backend.
     * For the ear the URL would be: localhost:3000/layers/Ohr
     * It then saves these images into the activeLayer array.
     * @param elem.ebene is the layer variable of the selected element.
     */
    selectLayer(elem) {
        $.getJSON('/layers/' + elem.ebene)
            .then(response => this.setState({imageElements: response}));
        this.setState({
            activeLayer: elem.ebene
        })
    }

    showIcd(){
        $.getJSON('/api/v1/maps/' + this.props.showingIcdId)
            .then(response => this.setState({imageElements: response}));
    }

    /**
     * The selectPng Method is the main Method of the Mapping component.
     * It receives the x, y coordinates and the amount of images inside a layer as an input.
     * Then it traverses all the different images and checks, which color an image has at the specific coordinates.
     * If the color is transparent, then the user didn't click on that image and otherwise he did.
     * Afterwards the id of said image is saved to the selectedId state.
     * The selected image has an opacity of 1, while all others have one of 0.5,
     * this is so that the user can see the selected image.
     * @param x is the X coordinate, at which a click happens
     * @param y is the Y coordinate, at which a click happens
     * @param len The size of the selectedLayers array, the amount of images.
     */
    selectPng(x, y, len) {
        let canvas = document.getElementById('canvas');
        let context = canvas.getContext('2d');
        let elem = this.state.imageElements;
        let myImg, data;
        for (let i = 0; i < len; i++) {
            myImg = document.getElementById(elem[i].id);
            context.drawImage(myImg, 0, 0);
            data = context.getImageData(x, y, 1, 1).data;
            if (data[0] !== 0 && data[1] !== 0 && data[2] !== 0 && data[3] !== 0) {
                this.sendIcdToMainUI(elem[i].id);
                this.setState({selectedId: elem[i].id});
                myImg.style.opacity = '1';
                //Since an image was found the rest don't need to be searched.
                for (i++; i < len; i++) {
                    myImg = document.getElementById(elem[i].id);
                    myImg.style.opacity = '0.5';
                }
            } else {
                myImg.style.opacity = '0.5';
            }
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    render() {
        const divStyle = {position: 'absolute'};
        const {x, y} = this.state;
        const len = this.state.imageElements.length;

        //Displays all the images from the selectedLayer array
        let alleElemente = this.state.imageElements.map((elem, index) => {
            return <div key={index} onClick={this.selectPng.bind(this, x, y, len)}>
                <img src={elem.img} style={divStyle} id={elem.id} alt='missing images'/>
            </div>
        });

        //gets a list of all layers
        let alleLayers = this.state.layers.map((elem, index) => {
            return <div className="dropdown-item" key={index} onClick={this.selectLayer.bind(this, elem)}>
                {elem.ebene}
            </div>
        });

        //Puts all the Layers into a dropdown Menu, from which a user can select them
        const dropdown = (
            <div className="col-2 dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {this.state.activeLayer}
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    {alleLayers}
                </div>
            </div>
        );

        return (
            <div>
                <div className="row">
                    {dropdown}
                    <input type="submit" value="refresh" onClick={this.showIcd.bind(this)}/>
                </div>
                <canvas id='canvas' style={divStyle} width="600" height="530"/>
                <div onMouseMove={this._onMouseMove.bind(this)} id='mappingComp'>
                    {this.props.showingIcdId}
                    {alleElemente}
                </div>
            </div>
        )
    }
}

export default Mapping;
