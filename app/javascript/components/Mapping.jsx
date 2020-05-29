import React from 'react';
import $ from "jquery";
import LayerOptions from './ManageLayers/LayerOptions';
import loadingGif from '../../assets/images/Preloader_2.gif';


/**
 * The Mapping component is one that displays the individual layers e.g Ohr,
 * so that the user can see and interact with them. It enables the user to choose
 * between the Layers through a dropdown Menu and It also allows a User to click
 * on specific images, to choose them.
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

    /**
     * Makes sure that Mapping has all the necessary layers and maps and Images
     * before mounting the MainUi
     */
    componentDidMount() {
        $.getJSON('/api/v1/layers')
            .then(response => this.setState({allImages: response}));
        $.getJSON('/api/v1/all/layers')
            .then(response => this.setState({layers: response}));
        $.getJSON('api/v1/maps')
            .then(response => this.setState({maps: response}))
    }

    /**
     * Has Many methods, which react to change in the environment.
     * showingIcdId: Changes the current mapped Icd and can cause different mapped images to show
     * editable: Allows for clicks in the Mapping and to add new Layers
     * layerFragmentStack: Updates selected Images from the Layerlist
     * map: sees if something new was mapped and reloads maps Array
     * mapLayerList: Deletes a map through the layerList
     * hightlightedPng: highlights the image when hovering over it
     * needUpdate: resets mapping, once the ICD Mapping button is clicked
     */
    componentDidUpdate(prevProps, prevState) {
        if (this.props.showingIcdId !== prevProps.showingIcdId) {
            if (this.props.showingIcdId !== 0) {
                let mappedImages = this.getImagesFromMaps(this.props.showingIcdId);
                this.setState({mappedImages: mappedImages});
                this.selectMappedImages(mappedImages);
                this.selectMappedLayers(mappedImages);
            } else {
                this.setState({
                    selectedImages: [],
                    selectedImagesBackup: [],
                    mappedImages: [],
                    selectedMappedImages: [],
                    mappedLayers: []
                });
                this.selectAll(true);
            }
        }

        if (this.props.editable !== prevProps.editable || (this.state.mapView !== prevState.mapView && this.state.mapView === true)) {
            this.changeViewTo('map');
            this.setState({selectedImages: this.state.selectedMappedImages});
            this.selectMappedImages(this.state.mappedImages);
            this.sendIcdToMainUI([], true, []);
        }

        if (this.props.layerFragmentStack !== prevProps.layerFragmentStack && this.props.showingIcdId === prevProps.showingIcdId && this.props.map === prevProps.map) {
            this.selectPngsFromList(this.props.layerFragmentStack);
        }
        if (this.props.map !== prevProps.map) {
            setTimeout(() => {
                $.getJSON('api/v1/maps')
                    .then(response => this.setState({maps: response}))
            });
        }
        if (this.state.maps !== prevState.maps) {
            let mappedImages = this.getImagesFromMaps(this.props.showingIcdId);
            this.setState({mappedImages: mappedImages});
            this.selectMappedImages(mappedImages);
            this.selectMappedLayers(mappedImages);
        }
        if (this.props.mapLayerList !== prevProps.mapLayerList) {
            this.deleteMap(this.props.mapLayerList);
        }
        if (this.props.hightlightedPng !== prevProps.hightlightedPng) {
            if (this.props.hightlightedPng !== '') {
                this.highlightPng(this.props.hightlightedPng);
            }
            else {
                this.setBackToPreviousSelection();
            }
        }
        if (this.props.needUpdate !== prevProps.needUpdate) {
            this.setState({
                activeLayer: 'Gehirn Längsschnitt',
                mappedImage: [],
                mappedLayers: [],
                selectedImage: [],
                selectedImagesBackup: [],
                selectedMappedImages: [],
            });
            this.selectMappedImages([]);
        }
    }

    /**
     * A Callback, once a new Layer is made the mapping has to be updated.
     * It updates all the layers through the backend, since the layer id isn't known.
     * @param layer contains (name, ebene, img) as to find and integrate the image
     */
    callbackallImages = (layer) => {
        this.setState({allImages: this.state.allImages.concat(layer)});
        setTimeout(() => {
            $.getJSON('/api/v1/layers')
                .then(response => this.setState({allImages: response}));
            $.getJSON('/api/v1/all/layers')
                .then(response => this.setState({layers: response}));
        });
    };

    /**
     * Once an image has been deleted, the mapping gets a callback, as to delete it aswell
     * The Backend has to be called again, since we don't know if the layers still contain other images
     * or are empty after deleting this one.
     * @param id an id as to locate the image by
     */
    callbackDeleteFromMapping = (id) => {
        let newImages = this.state.allImages.filter((image) => image.id !== id);
        this.setState({allImages: newImages});
        setTimeout(() => {
            $.getJSON('/api/v1/all/layers')
                .then(response => this.setState({layers: response}));
        });
    }

    /**
     * A method, which sends the chosen images back to the Main Ui, so that other components,
     * like the details card can access it. It also has a
     * @param images An Array of all the selected Images
     * @param selectedFromMapping. This is true everywhere except when coming from the LayerList
     * @param mappedImages An array of all Mapped Images, so we could filter them out.
     * As to not send already mapped images to NewMaps
     */
    sendIcdToMainUI(images, selectedFromMapping, mappedImages) {
        for (let i = 0; i < mappedImages.length; i ++){
            images = images.filter((image) => image.name !== mappedImages[i].name);
        }
        this.props.callbackFromMainUISelection(images, selectedFromMapping);
    }

    /**
     * A Method, which simply deletes a map from all Possible arrays. No backend call is needed in this case.
     * @param map The map, which is supposed to be deleted. Recieved from LayerList
     */
    deleteMap(map) {
        let map_id = map.map_id;
        let newMaps = this.state.maps.filter((map) => map.id !== map_id);
        let newBackup = this.state.selectedImagesBackup.filter((image) => (image.name !== map.name || image.ebene !== map.ebene));
        let newMapped = this.state.mappedImages.filter((image) => image.name !== map.name);
        let newSelectedMap = this.state.selectedMappedImages.filter((image) => image.name !== map.name);
        this.setState({
            maps: newMaps,
            selectedImagesBackup: newBackup,
            mappedImages: newMapped,
            selectedMappedImages: newSelectedMap
        });
    }

    /**
     * The _onMouseMove Method tracks the mouse movements of a User within the Mapping.
     * This is later needed in selectPng, as to know at which coordinates a click happens.
     */
    _onMouseMove(e) {
        this.setState({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY});
    }

    /**
     * Once a layer is selected, activeLayer is set to that and selectedImages is reset,
     * as not to keep old images. It then selects all mappedImages with the new Layer in mind.
     * @param elem.ebene is the layer, to which we want to switch
     */
    selectLayer(ebene) {
        this.setState({
            activeLayer: ebene,
            selectedImages: []
        });
        this.props.callbackFromMainUIActiveLayer(ebene);
        setTimeout(() => {
            this.selectMappedImages(this.state.mappedImages)
        });
    }

    /**
     * A simple method, which sets the Opacity of all images to 1 if x=true
     * or sets the opacity of all Images to 0.3 if x=false.
     * This method is used in many other places of the Component, like selectPng.
     * @param x
     */
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

    /**
     * Once an Icd is selected this goes through the maps and Images array and selects
     * all images, which are mapped to the selected Icd.
     * @param icdId The id, with which to filter the maps
     * @returns mappedImages An array with all images, that are mapped to the Icd
     */
    getImagesFromMaps(icdId){
        let allImages = this.state.allImages;
        let maps = this.state.maps.filter((map) => map.icd_id === icdId);
        let mappedImages = [];
        for (let i = 0; i < maps.length; i++) {
                let id = maps[i].layer_id;
                for (let x = 0; x < allImages.length; x++) {
                    if (allImages[x].id === id) {
                        mappedImages = mappedImages.concat(allImages[x]);
                        x = allImages.length;
                    }
                }
            }
        return mappedImages;
    }

    /**
     * This Method takes the mappedImages Array and selects them on the Screen
     * It sets the Opacity of nonselected Images to 0.3 and the ones of selected to 1
     * The filtering by Layers Happens here, as to not recall getImagesFromMaps every time.
     * @param mappedImages an Array recieved from getImagesFromMaps
     */
    selectMappedImages(mappedImages) {
        this.selectAll(false);
        let selectedImages = [];
        let activeLayer = this.state.activeLayer
        for (let i = 0; i < mappedImages.length; i++) {
            if (mappedImages[i].ebene === activeLayer) {
                let myImg = document.getElementById(mappedImages[i].name);
                if (myImg !== null){
                    myImg.style.opacity = '1';
                    selectedImages = selectedImages.concat(mappedImages[i]);
                }
            }
        }
        if (selectedImages.length === 0) {
            this.selectAll(true);
        }
        this.setState({
            selectedImages: selectedImages, selectedImagesBackup: selectedImages,
            selectedMappedImages: selectedImages
        });

        this.sendIcdToMainUI([], false, []);
    }

    /**
     * This is a Method, which makes the layers with selected Images in them appear
     * blue in the Dropdown Menu. This way you know in which Layer maps already exist.
     * @param mappedImages Makes a List of selected Layers out of the array of Images
     */
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
     * The selectPng Method receives the x, y coordinates and editable, which makes a click possible or not.
     * The Method goes through all the images and checks, which color an image has at the specific x, y coordinates.
     * If the color is transparent, then the user didn't click on that image. If the Image isn't transparent he did.
     * To do this it paints a 1x1 pixel cut of an image onto a canvas and then checks its color.
     * Afterwards the image is saved to the selectedImages Array.
     * @param x is the X coordinate, at which a click happens
     * @param y is the Y coordinate, at which a click happens
     * @param editable This refers to the edit Mode in the Top right.
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
                        this.sendIcdToMainUI(selectedImages, true, this.state.selectedMappedImages);
                    }
                }
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
            if (selectedImages.length === 0) {
                this.selectAll(true);
            }
        }
    }

    /**
     * This is a helper Method of selectPng. It checks if the clicked on Image has been Mapped
     * yet or not. If yes, then a click isn't possible, you would first have to delete the map through
     * the Layerlist Component. If it hasn't been mapped yet, then you can select/unselect it.
     * @param elem the clicked on image
     * @returns {boolean} weather it has been Mapped
     */
    isMapped(elem){
        let selectedMappedImages = this.state.selectedMappedImages;
        for (let i = 0; i < selectedMappedImages.length; i++){
            if (elem.id === selectedMappedImages[i].id){
                return true;
            }
        }
        return false;
    }

    /**
     * This is another helper Method of selectPng. It checks, where in the selectedImages
     * array an Images is located. Once found it returns the location and the Image is cut out.
     * If nothing is found, then false is returned and the image gets added to the array
     * @param elem The clicked on image
     * @param selectedImages the array of all Images
     * @returns {boolean|number} The location in the array
     */
    containsImage(elem, selectedImages){
        for (let i = 0; i < selectedImages.length; i++) {
            if (selectedImages[i].id === elem.id) {
                return i;
            }
        } return false;
    }

    /**
     * The selectPngFromList method receives fragments (pngs) from the Layerlist and selects them
     * @param layerFragmentList are the selected pngs from external source
     */
    selectPngsFromList(layerFragmentList) {
        let elem = this.state.allImages;
        let frags = layerFragmentList;
        let selectedImages = this.state.selectedMappedImages;
        let nonMapped = [];

        for (let x = 0; x < frags.length; x++) {
            for (let i = 0; i < elem.length; i++) {
                if (frags[x].name === elem[i].name) {
                    nonMapped = nonMapped.concat(elem[i]);
                    i = elem.length;
                }
            }
        }
        selectedImages = selectedImages.concat(nonMapped);

        this.setState({
            selectedImages: selectedImages,
            selectedImagesBackup: selectedImages
        });
        this.sendIcdToMainUI(nonMapped, false, []);
    }

    /**
     * The highlightPng method receives a fragment (png) from backend and highlights it
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

    /**
     * The setBackToPreviousSelection method is called after the cursor exits the list of fragments
     * it resets the higlight to the selection the user made previously
     */
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

    /**
     * The changeViewTo switches between the two viewmodes mapview and listview
     * listview is to add new Images and mapview is to select them
     */
    changeViewTo(view) {
        if (view === 'map') {
            this.setState({mapView: true});
            setTimeout(() => {
                this.selectMappedImages(this.state.mappedImages)
            });
            this.props.callbackFromMainUIMinimizeLayerList(false);
        } else {
            this.setState({mapView: false});
            this.props.callbackFromMainUIMinimizeLayerList(true);
        }
    }

    /**
     * The render Method, which simply displays all the elements, which we want the User to see
     * This includes All the images and the dropdown and the selection between
     * Adding layers and the Mapping
     * @returns {*}
     */
    render() {
        let allElements = [];
        let allLayers = [];

        let {x, y} = this.state;
        let activeLayer = this.state.activeLayer;
        const editable = this.props.editable;
        const mapView = this.state.mapView;

        // Styles
        const rowStyle = {
            height: '5vh'
        };
        const divStyle = {
            position: 'absolute'
        };
        const dropdownStyle = {
            height: '30px'
        };
        const bootstrapSelectedMapButton = "col-6 border border-primary bg-primary rounded-left text-white p-0 pl-2 pr-2 font-weight-bold";
        const bootstrapSelectedListButton = "col-6 border border-primary bg-primary rounded-right text-white p-0 pl-2 pr-2 font-weight-bold";
        const bootstrapUnselectedMapButton = "col-6 border border-primary rounded-left text-primary p-0 pl-2 pr-2";
        const bootstrapUnselectedListButton = "col-6 border border-primary rounded-right text-primary p-0 pl-2 pr-2";
        const loadingImgStyle = {
            zIndex: 100,
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '50px',
            height: '50px',
            marginTop: '-25px',
            marginLeft: '-25px',
        };
        const loadingDivStyle = {
            zIndex: 99,
            top: '0%',
            left: '0%',
            height: '100%',
            width: '100%',
            position: 'absolute',
            backgroundColor: 'rgba(255,255,255,0.7)',
        };

        // Component Parts
        const loadingImg = (
            <div style={loadingDivStyle}>
                <img src={loadingGif} style={loadingImgStyle}/>
            </div>
        );
        allElements = this.state.allImages.map((elem, index) => {
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
        allLayers = this.state.layers.map((elem, index) => {
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
                    {allLayers}
                </div>
            </div>
        );
        const viewButton = (
            <div className="row mr-4 text-center">
                <button
                    className={mapView ? bootstrapSelectedMapButton : bootstrapUnselectedMapButton}
                    type="button"
                    style={dropdownStyle}
                    onClick={this.changeViewTo.bind(this, 'map')}
                >
                    Mapping
                </button>
                <button
                    className={mapView ? bootstrapUnselectedListButton : bootstrapSelectedListButton}
                    type="button"
                    style={dropdownStyle}
                    onClick={this.changeViewTo.bind(this, 'list')}
                >
                    Edit Layers
                </button>
            </div>
        );
        const map = (
          <>
            <canvas id='canvas' style={divStyle} width="600" height="530"/>
            <div onMouseMove={this._onMouseMove.bind(this)} id='mappingComp'
                 onClick={this.selectPng.bind(this, x, y, editable)}>
                {allElements}
            </div>
          </>
        );
        const list = (
            <LayerOptions
                callbackFromMapping={this.callbackallImages}
                callbackDeleteFromMapping={this.callbackDeleteFromMapping}
            />
        );

        const loading = (allElements.length === 0 && mapView);

        return (
            <div>
                <div className="row" style={rowStyle}>
                    <div className="col-md-auto">
                        {mapView ? dropdown : null}
                    </div>
                    <div className="col" />
                    <div className="col-5">
                        {editable ? viewButton : null}
                    </div>
                </div>
                {loading ? loadingImg : null}
                { mapView ? map : list }
            </div>
        )
    }
}

export default Mapping;
