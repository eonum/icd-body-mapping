import React from 'react';
import $ from "jquery";
import LayerOptions from './ManageLayers/LayerOptions'

/**
 * The Mapping component is one that displays the individual layers,
 * so that the user can see them and interact with them.
 * It allows the user to choose between the Layers with a dropdown Menu,
 * It also registers clicks from a user and checks which image was chosen in the selectPng Method.
 * @author Marius Asadauskas, Aaron Saegesser
 */
class Mapping extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allImages: [],
            maps: [],
            mappedImages: [], selectedMappedImages: [],
            mappedLayers: [],
            layers: [],
            selectedImages: [], selectedImagesBackup: [],
            x: 0, y: 0,
            activeLayer: 'Gehirn Längsschnitt',
            mapView: true,
        };
        this.callbackallImages = this.callbackallImages.bind(this);
    }

    componentDidMount() {
        $.getJSON('/api/v1/layers')
            .then(response => this.setState({allImages: response}));
        $.getJSON('/api/v1/all/layers')
            .then(response => this.setState({layers: response}));
        $.getJSON('api/v1/maps')
            .then(response => this.setState({maps: response}))
    }

    /**
     * Updates the image array with the images of an icd,
     * once the prop showingIcdId changes.
     */
    componentDidUpdate(prevProps, prevState) {
        if (this.props.showingIcdId !== prevProps.showingIcdId) {
            if (this.props.showingIcdId !== 0) {
                let mappedImages = this.getImagesFromMaps(this.props.showingIcdId);
                this.setState({mappedImages: mappedImages});
                this.selectMappedImages(mappedImages);
                this.selectMappedLayers(mappedImages);
            } else {
                this.setState({selectedImages: [], selectedImagesBackup: []});
                this.selectAll(true);
            }
        }

        if (this.props.layerFragmentStack !== prevProps.layerFragmentStack && this.props.showingIcdId === prevProps.showingIcdId) {
            this.selectPngsFromList(this.props.layerFragmentStack);
        }

        if (this.props.map !== prevProps.map) {
            setTimeout(() => {
                $.getJSON('api/v1/maps')
                    .then(response => this.setState({maps: response}))
            }, 2000);
        }
        if (this.state.maps !== prevState.maps){
            let mappedImages = this.getImagesFromMaps(this.props.showingIcdId);
            this.setState({mappedImages: mappedImages});
            this.selectMappedImages(mappedImages);
            this.selectMappedLayers(mappedImages);
        }

        if (this.props.mapLayerList !== prevProps.mapLayerList) {
            this.deleteMap(this.props.mapLayerList);
        }

        if (this.props.selectedLayerFromList !== prevProps.selectedLayerFromList && this.props.selectedLayerFromList !== '') {
            this.selectLayer(this.props.selectedLayerFromList);
        }
        if (this.props.hightlightedPng !== prevProps.hightlightedPng && this.props.hightlightedPng !== '') {
            this.highlightPng(this.props.hightlightedPng);
        } else if (this.props.hightlightedPng !== prevProps.hightlightedPng && this.props.hightlightedPng === '') {
            this.setBackToPreviousSelection();
        }
        if (this.props.editable !== prevProps.editable && this.props.editable === false) {
            this.changeViewTo('map');
        }
        if (this.props.needUpdate !== prevProps.needUpdate) {
            this.setState({
                activeLayer: 'Gehirn Längsschnitt',
            });
        }
    }

    addNewMap(map) {
        this.setState({maps: this.state.maps.concat(map)});
    }

    deleteMap(map) {
        let map_id = map.map_id;
        let newMaps = this.state.maps.filter((map) => map.id !== map_id);
        let newBackup = this.state.selectedImagesBackup.filter((image) => (image.name !== map.name || image.ebene !== map.ebene));
        let newMapped = this.state.mappedImages.filter((image) => image.name !== map.name);
        let newSelectedMap = this.state.selectedMappedImages.filter((image) => image.name !== map.name);
        this.setState({maps: newMaps, selectedImagesBackup: newBackup, mappedImages: newMapped, selectedMappedImages: newSelectedMap});
    }

    callbackallImages = (layer) => {
        this.setState({allImages: this.state.allImages.concat(layer)});
        setTimeout(() => {
            $.getJSON('/api/v1/layers')
                .then(response => this.setState({allImages: response}));
            $.getJSON('/api/v1/all/layers')
                .then(response => this.setState({layers: response}));
        });

    };

    callbackDeleteFromMapping = (id) => {
        let newImages = this.state.allImages.filter((image) => image.id !== id);
        this.setState({allImages: newImages});
        setTimeout(() => {
            $.getJSON('/api/v1/all/layers')
                .then(response => this.setState({layers: response}));
        });
    }

    /**
     * A method, which sends the chosen image back to the Main Ui, so that other components,
     * like the details card can access it.
     * @param image holds the layer_id of an image
     */
    sendIcdToMainUI(image, selectedFromMapping) {
        this.props.callbackFromMainUI(image, selectedFromMapping);
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
        this.setState({
            activeLayer: ebene,
            selectedImages: [],
        });
        this.props.callbackFromMainUIActiveLayer(ebene);
        setTimeout(() => {
            this.selectMappedImages(this.state.mappedImages)
        });
    }

    selectAll(x) {
        let elem = this.state.allImages;
        let activeLayer = this.state.activeLayer;
        for (let i = 0; i < elem.length; i++) {
            if (elem[i].ebene === activeLayer) {
                let myImg = document.getElementById(elem[i].name);
                if (x === true && myImg !== null) {
                    myImg.style.opacity = '1';
                } else if (myImg !== null) {
                    myImg.style.opacity = '0.3';
                }
            }
        }
    }

    getImagesFromMaps(icdId){
        let allImages = this.state.allImages;
        let maps = this.state.maps;
        let mappedImages = [];
        for (let i = 0; i < maps.length; i++) {
            if (maps[i].icd_id === icdId) {
                let id = maps[i].layer_id;
                for (let x = 0; x < allImages.length; x++) {
                    if (allImages[x].id === id) {
                        mappedImages = mappedImages.concat(allImages[x]);
                        x = allImages.length;
                    }
                }
            }
        }
        return mappedImages;
    }

    selectMappedImages(mappedImages) {
        this.selectAll(false);
        let selectedImages = [];
        let activeLayer = this.state.activeLayer
        for (let i = 0; i < mappedImages.length; i++) {
            if (mappedImages[i].ebene === activeLayer) {
                console.log(mappedImages[i].name);
                document.getElementById(mappedImages[i].name).style.opacity = '1';
                selectedImages = selectedImages.concat(mappedImages[i]);
            }
        }
        if (selectedImages.length === 0) {
            this.selectAll(true);
        }
        this.setState({
            selectedImages: selectedImages, selectedImagesBackup: selectedImages,
            selectedMappedImages: selectedImages
        });
        this.sendIcdToMainUI(selectedImages, false);
    }

    selectMappedLayers(mappedImages){
        let notMappedLayers = this.state.layers;
        let mappedLayers = [];
        for(let i = 0; i < mappedImages.length; i++) {
            mappedLayers = mappedLayers.concat(notMappedLayers.filter((layer) => layer.ebene === mappedImages[i].ebene));
            notMappedLayers = notMappedLayers.filter((layer) => layer.ebene !== mappedImages[i].ebene);
        }
        this.setState({mappedLayers: mappedLayers});
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
    selectPng(x, y, editable) {
        if (editable === true){
            let canvas = document.getElementById('canvas');
            let context = canvas.getContext('2d');
            let elem = this.state.allImages;
            let activeLayer = this.state.activeLayer;
            let selectedImages = this.state.selectedImages;

            if (selectedImages.length === 0) {
                this.selectAll(false);
            }
            for (let i = 0; i < elem.length; i++) {
                if (elem[i].ebene === activeLayer) {
                    let myImg = document.getElementById(elem[i].name);
                    context.drawImage(myImg, 0, 0);
                    let data = context.getImageData(x, y, 1, 1).data;
                    if (data[0] !== 0 && data[1] !== 0 && data[2] !== 0 && data[3] !== 0) {
                        let cont = this.containsImage(elem[i], selectedImages);
                        if (cont === false){
                            myImg.style.opacity = '1';
                            selectedImages = selectedImages.concat(elem[i]);
                        } else {
                            if (this.isMapped(elem[i]) === false){
                                selectedImages.splice(cont, 1);
                                myImg.style.opacity = '0.3';
                            }
                        }
                        this.setState({selectedImages: selectedImages, selectedImagesBackup: selectedImages});
                        this.sendIcdToMainUI(selectedImages, true);
                    }
                }
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
            if (selectedImages.length === 0) {
                this.selectAll(true);
            }
        }
    }

    isMapped(elem){
        let selectedMappedImages = this.state.selectedMappedImages;
        for (let i = 0; i < selectedMappedImages.length; i++){
            if (elem.id === selectedMappedImages[i].id){
                return true;
            }
        }
        return false;
    }

    containsImage(elem, selectedImages){
        for (let i = 0; i < selectedImages.length; i++) {
            if (selectedImages[i].id === elem.id) {
                return i;
            }
        }
        return false;
    }

    /**
     * The selectPngFromList method receives a fragment (png) from backend and highlights it
     * @param fragment is the selected png from external source
     */
    highlightPng(fragment) {
        if (fragment.ebene === this.state.activeLayer) {
            let elem = this.state.allImages;

            elem = elem.filter((img) => {
                if (img.ebene === fragment.ebene) {
                    return img;
                }
            });

            this.selectAll(false);
            for (let i = 0; i < elem.length; i++) {
                if (elem[i].name === fragment.name) {
                    document.getElementById(elem[i].name).style.opacity = '1';
                    i = elem.length;
                }
            }
        }
    }

    selectPngsFromList(layerFragmentList) {
        let elem = this.state.allImages;
        let frags = layerFragmentList;
        let selectedImages = this.state.selectedMappedImages;

        for (let x = 0; x < frags.length; x++) {
            for (let i = 0; i < elem.length; i++) {
                if (frags[x].name === elem[i].name) {
                    selectedImages = selectedImages.concat(elem[i]);
                }
            }
        }

        this.setState({selectedImages: selectedImages, selectedImagesBackup: selectedImages});
        this.sendIcdToMainUI(selectedImages, false);
    }

    setBackToPreviousSelection() {
        let elem = this.state.allImages;
        let selectedImages = this.state.selectedImagesBackup;
        let selectedImgsInActiveLayer;
        let found;

        selectedImgsInActiveLayer = selectedImages.filter((img) => {
            if (img.ebene === this.state.activeLayer) {
                return img;
            }
        });
        if (selectedImgsInActiveLayer.length > 0) {
            elem = elem.filter((img) => {
                if (img.ebene === this.state.activeLayer) {
                    return img;
                }
            });
            for (let i = 0; i < elem.length; i++) {
                let myImg = document.getElementById(elem[i].name);
                found = selectedImages.find((img) => {
                    return img.name === elem[i].name
                });
                if (found !== undefined) {
                    myImg.style.opacity = '1';
                } else {
                    myImg.style.opacity = '0.3';
                }
            }
            this.setState({selectedImages: selectedImages});
        } else {
            this.selectAll(true);
        }
    }

    changeViewTo(view) {
        if (view === 'map') {
            this.setState({
                mapView: true,
            });
            this.props.callbackFromMainUIMinimizeLayerList(true);
        } else {
            this.setState({
                mapView: false,
            });
            this.props.callbackFromMainUIMinimizeLayerList(false);
        }
    }

    render() {
        const rowStyle = {height: '5vh'};
        const divStyle = {position: 'absolute'};
        const dropdownStyle = {height: '30px'};
        let {x, y} = this.state;
        let activeLayer = this.state.activeLayer;
        const editable = this.props.editable;
        const mapView = this.state.mapView;

        const bootstrapSelectedMapButton = "col-6 border border-primary bg-primary rounded-left text-white p-0 pl-2 pr-2 font-weight-bold";
        const bootstrapSelectedListButton = "col-6 border border-primary bg-primary rounded-right text-white p-0 pl-2 pr-2 font-weight-bold";
        const bootstrapUnselectedMapButton = "col-6 border border-primary rounded-left text-primary p-0 pl-2 pr-2";
        const bootstrapUnselectedListButton = "col-6 border border-primary rounded-right text-primary p-0 pl-2 pr-2";

        let alleElemente = this.state.allImages.map((elem, index) => {
            if (elem.ebene === activeLayer) {
                return <div key={index}>
                    <img src={elem.img} style={divStyle} id={elem.name} alt='missing images'
                         onError={(e) => {
                             e.target.onerror = null;
                             e.target.src = "./images/error.png"
                         }}/>
                </div>
            }
        });

        let alleLayers = this.state.layers.map((elem, index) => {
            let mappedLayers = this.state.mappedLayers;
            for (let i = 0; i < mappedLayers.length; i++){
                if(elem === mappedLayers[i]){
                    return <div className="dropdown-item text-primary" key={index} onClick={this.selectLayer.bind(this, elem.ebene)}>
                        {elem.ebene}
                    </div>
                }
            }
            return <div className="dropdown-item" key={index} onClick={this.selectLayer.bind(this, elem.ebene)}>
                {elem.ebene}
            </div>
        });

        const dropdown = (
            <div className="col-3 dropdown">
                <button className="btn btn-outline-primary p-0 pl-2 pr-2 font-weight-bold dropdown-toggle"
                        style={dropdownStyle} type="button" id="dropdownMenuButton"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {this.state.activeLayer}
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    {alleLayers}
                </div>
            </div>
        );

        const viewButton = (
            <div className="row mr-4 text-center">
                <div
                    className={mapView ? bootstrapSelectedMapButton : bootstrapUnselectedMapButton}
                    type="button"
                    style={dropdownStyle}
                    onClick={this.changeViewTo.bind(this, 'map')}
                >
                    map
                </div>
                <div
                    className={mapView ? bootstrapUnselectedListButton : bootstrapSelectedListButton}
                    type="button"
                    style={dropdownStyle}
                    onClick={this.changeViewTo.bind(this, 'list')}
                >
                    list
                </div>
            </div>
        );

        const map = (
          <>
            <canvas id='canvas' style={divStyle} width="600" height="530"/>
            <div onMouseMove={this._onMouseMove.bind(this)} id='mappingComp'
                 onClick={this.selectPng.bind(this, x, y, editable)}>
                {alleElemente}
            </div>
          </>
        );

        const list = (<LayerOptions callbackFromMapping={this.callbackallImages} callbackDeleteFromMapping={this.callbackDeleteFromMapping}/>)

        return (
            <div>
                <div className="row" style={rowStyle}>
                    <div className="col-md-auto">
                        {mapView ? dropdown : null}
                    </div>
                    <div className="col" />
                    <div className="col-3">
                        {editable ? viewButton : null}
                    </div>
                </div>
                { mapView ? map : list }
            </div>
        )
    }
}

export default Mapping;
