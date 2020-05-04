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
            allImages: [], allImagesBackup: [],
            layers: [], layersBackup: [],
            selectedImages:[],
            x: 0, y: 0,
            showAll: false,
            activeLayer: 'Ohr'
        };
    }

    componentDidMount() {
        $.getJSON('/api/v1/all/layers')
            .then(response => this.setState({allImages: response, allImagesBackup: response}));
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
                    .then(response => this.setState({allImages: response}));
                $.getJSON('/api/v1/map_layers/' + this.props.showingIcdId)
                    .then(response => this.setState({layers: response, activeLayer: response[0].ebene}));
            } else {
                this.setState({allImages: this.state.allImagesBackup, layers: this.state.layersBackup});
                this.selectAll(true);
            }
        }
        if (this.props.selectedLayerFromList !== prevProps.selectedLayerFromList && this.props.selectedLayerFromList !== '') {
            this.selectLayer(this.props.selectedLayerFromList);
        }
        if (this.props.hightlightedPng !== prevProps.hightlightedPng && this.props.hightlightedPng !== '') {
            this.highlightPng(this.props.hightlightedPng);
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
        this.setState({activeLayer: ebene});
        this.props.callbackFromMainUIActiveLayer(ebene);
    }

    selectAll(x) {
        let elem = this.state.allImages;
        let activeLayer = this.state.activeLayer;
        for (let i = 0; i < elem.length; i++) {
            if (elem[i].ebene === activeLayer){
                let myImg = document.getElementById(elem[i].name);
                if (x===true){
                    myImg.style.opacity = '1';
                } else {myImg.style.opacity = '0.4';}
            }
        }
    }

    showAll() {
        this.setState({showAll: !this.state.showAll, selectedImages: []});
        this.setState({allImages: this.state.allImagesBackup, layers: this.state.layersBackup});
        this.selectAll(true);
        this.sendIcdToMainUI(this.state.showAll);
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
        let canvas = document.getElementById('canvas');
        let context = canvas.getContext('2d');
        let elem = this.state.allImages;
        let activeLayer = this.state.activeLayer;
        let selectedImages = this.state.selectedImages;
        if (selectedImages.length === 0){
            this.selectAll(false);
        }
        for (let i = 0; i < len; i++) {
            if (elem[i].ebene === activeLayer) {
                let myImg = document.getElementById(elem[i].name);
                context.drawImage(myImg, 0, 0);
                let data = context.getImageData(x, y, 1, 1).data;
                if (data[0] !== 0 && data[1] !== 0 && data[2] !== 0 && data[3] !== 0) {
                    let contains = false
                    for (let tra = 0; tra < selectedImages.length; tra++) {
                        if (selectedImages[tra] === elem[i]) {
                            selectedImages.splice(tra,1);
                            myImg.style.opacity = '0.4';
                            x = selectedImages.length;
                            contains = true;
                        }
                    }
                    if (contains === false){
                        myImg.style.opacity = '1';
                        selectedImages[selectedImages.length] = elem[i];
                    }
                    i = len;
                    this.setState({selectedImages: selectedImages});
                    this.sendIcdToMainUI(selectedImages);
                }
            }
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
        console.log(selectedImages);
    }

    /**
     * The selectPngFromList method receives a fragment (png) from backend and highlights it
     * @param fragment is the selected png from external source
     */
    highlightPng(fragment) {
        if (fragment.ebene === this.state.activeLayer) {
            let elem = this.state.allImages;
            let selectedImage = [];

            elem = elem.filter((img) => {
                if (img.ebene === fragment.ebene) {
                    return img;
                }
            });

            this.selectAll(false);

            for (let i = 0; i < elem.length; i++) {
                let myImg = document.getElementById(elem[i].name);
                if (elem[i].name === fragment.name) {
                    myImg.style.opacity = '1';
                    selectedImage.push(fragment);
                } else {
                    myImg.style.opacity = '0.4';
                }
            }
            this.setState({selectedImages: selectedImage});
            this.sendIcdToMainUI(selectedImage);
        }
    }

    render() {
        const divStyle = {position: 'absolute'};
        let {x, y} = this.state;
        const len = this.state.allImages.length;
        let activeLayer = this.state.activeLayer;

        let alleElemente = this.state.allImages.map((elem, index) => {
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
