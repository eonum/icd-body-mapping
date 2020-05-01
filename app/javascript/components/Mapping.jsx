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
            imageElementsBackup: [],
            layers: [],
            layersBackup: [],
            x: 0, y: 0,
            selectedImg: '',
            showAll: false,
            activeLayer: 'Ohr'
        };
    }

    componentDidMount() {
        $.getJSON('/api/v1/all/layers')
            .then(response => this.setState({imageElements: response, imageElementsBackup: response}));
        $.getJSON('/api/v1/layers')
            .then(response => this.setState({layers: response, layersBackup: response}));
    }

    /**
     * Updates the image array with the images of an icd,
     * once the prop showingIcdId changes.
     */
    componentDidUpdate(prevProps) {
        if(this.props.showingIcdId !== prevProps.showingIcdId) {
            if (this.props.showingIcdId !== 0){
                $.getJSON('/api/v1/map/' + this.props.showingIcdId)
                    .then(response => this.setState({imageElements: response}));
                $.getJSON('/api/v1/map_layers/' + this.props.showingIcdId)
                    .then(response => this.setState({layers: response, activeLayer: response[0].ebene}));
            } else {
                this.setState({imageElements: this.state.imageElementsBackup, layers: this.state.layersBackup});
            }
        }
    }

    /**
     * A method, which sends the chosen image back to the Main Ui, so that other components,
     * like the details card can access it.
     * @param image holds the layer_id of an image
     */
    sendIcdToMainUI(image) {
        this.props.callbackFromMainUI(image);
    }

    /**
     * The _onMouseMove Method tracks the mouse movements of a User within the details card.
     * This is later needed in selectPng, as to know at which coordinates a click happens.
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
    selectLayer(ebene) {
        this.setState({activeLayer: ebene})
    }

    resetSelected(){
        const elem = this.state.imageElements;
        const activeLayer = this.state.activeLayer;
        for (let i = 0; i < elem.length; i++) {
            if (elem[i].ebene === activeLayer){
                let myImg = document.getElementById(elem[i].name);
                myImg.style.opacity = '1';
            }
        }
    }

    showAll() {
        this.setState({showAll: !this.state.showAll, selectedImg: ''});
        this.sendIcdToMainUI(this.state.showAll);
        this.resetSelected();
    }

    /**
     * The selectPng Method receives the x, y coordinates and the length of the imageElements array.
     * Then it goes through all the different images and checks, which color an image has at the specific coordinates.
     * If the color is transparent, then the user didn't click on that image and otherwise he did.
     * To do this it paints a 1x1 pixel cut of an image onto a canvas and then checks its colour.
     * Afterwards the id of said image is saved to the selectedId state.
     * @param x is the X coordinate, at which a click happens
     * @param y is the Y coordinate, at which a click happens
     * @param len The size of the selectedLayers array, the amount of images.
     */
    selectPng(x, y, len) {
        const canvas = document.getElementById('canvas');
        const context = canvas.getContext('2d');
        let elem = this.state.imageElements;
        let activeLayer = this.state.activeLayer;
        for (let i = 0; i < len; i++) {
            if (elem[i].ebene === activeLayer){
                let myImg = document.getElementById(elem[i].name);
                context.drawImage(myImg, 0, 0);
                let data = context.getImageData(x, y, 1, 1).data;
                if (data[0] !== 0 && data[1] !== 0 && data[2] !== 0 && data[3] !== 0) {
                    this.sendIcdToMainUI(elem[i]);
                    this.setState({selectedImg: elem[i]});
                    myImg.style.opacity = '1';
                    //Since an image was found the rest don't need to be searched.
                    for (i++; i < len; i++) {
                        if(elem[i].ebene === activeLayer){
                            myImg = document.getElementById(elem[i].name);
                            myImg.style.opacity = '0.4';
                        }
                    }
                } else {myImg.style.opacity = '0.4';}
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    }

    render() {
        const divStyle = {position: 'absolute'};
        let {x, y} = this.state;
        const len = this.state.imageElements.length;
        let activeLayer = this.state.activeLayer;

        let alleElemente = this.state.imageElements.map((elem, index) => {
            if (elem.ebene === activeLayer){
                return <div key={index}>
                    <img src={elem.img} style={divStyle} id={elem.name} alt='missing images'
                         onError={(e)=>{e.target.onerror = null; e.target.src="./images/error.png"}}/>
                </div>
            }
        });

        let alleLayers = this.state.layers.map((elem, index) => {
            return <div className="dropdown-item" key={index} onClick={this.selectLayer.bind(this, elem.ebene)}>
                {elem.ebene}
            </div>
        });

        const dropdown = (
            <div className="col-3 dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {this.state.activeLayer}
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    {alleLayers}
                </div>
            </div>
        );

        const rowStyle = {height: '8vh'};

        return (
            <div>
                <div className="row" style={rowStyle}>
                    {dropdown}
                    <div className="col-2">
                        <input
                            className="btn btn-primary"
                            type="submit"
                            value='show all'
                            onClick={this.showAll.bind(this)}
                        />
                    </div>
                    <div className="col-7">
                        <h4 className="text-right text-primary">{this.state.selectedImg.name}</h4>
                    </div>
                </div>
                <canvas id='canvas' style={divStyle} width="600" height="530"/>
                <div onMouseMove={this._onMouseMove.bind(this)} id='mappingComp' onClick={this.selectPng.bind(this, x, y, len)}>
                    {alleElemente}
                </div>
            </div>
        )
    }
}

export default Mapping;
