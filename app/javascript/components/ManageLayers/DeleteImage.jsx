import React from "react";
import $ from "jquery";
import DeleteIcon from '@material-ui/icons/Delete';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import loadingGif from '../../../assets/images/Preloader_2.gif';

/**
 * The DeleteImage Component has 2 main tasks. First to display All Images, as to make finding
 * a specific one with ease. The second is the Possibility to delete the Image once found.
 */
class DeleteImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allImages: [],
            layers: [],
            mouseOver: '',
            showLayer: '',
            load: true,
        };
        this.handleDelete = this.handleDelete.bind(this);
        this.deleteImage = this.deleteImage.bind(this);
    }

    componentDidMount() {
        this.getImages();
        this.getLayers();
    }

    /**
     * The component has to reset all Images once a new one is added, so this method
     * makes sure to call the Necessary other Methods, once a new image has been made.
     */
    componentDidUpdate(prevProps) {
        if (this.props.image !== prevProps.image){
            this.setState({load: true});
            setTimeout(() => {
                this.getImages();
                this.getLayers();
            });
        }
    }

    /**
     * Gets a List of all Images and sorts them alphabetically
     */
    getImages() {
        $.getJSON('/api/v1/layers')
            .then(response => this.setState({
                allImages: response.sort((a, b) => {
                    var nameA = a.name.toUpperCase();
                    var nameB = b.name.toUpperCase();
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0;
                })
            }));
    }

    /**
     * Gets a list of all Layers, as to make a list of Dropdown Menus
     * These then contain all them Images within the corresponding layer
     */
    getLayers() {
        $.getJSON('/api/v1/all/layers')
            .then(response => this.setState({
              layers: response,
              load: false,
            }));
    }

    /**
     * Makes a call to the Backend, as to delete the selected Image
     * Also sends the Image to Mapping, so that it can be removed.
     * @param image The image, on which the trashcan is pressed
     */
    handleDelete(image) {
        const id = image.id;
        const deletion = confirm('Do you want to delete ' + image.name);

        if (deletion) {
            this.setState({load: true});
            fetch(`http://localhost:3000/api/v1/layers/${id}`,
                {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json'}
                }).then((response) => {
                    if (response.ok){
                        this.deleteImage(id);
                    }
                })
        }
    }

    /**
     * Makes the callback and also removes the image from tha Allimages list
     * @param id The id by which to remove the image
     */
    deleteImage(id) {
        let newImages = this.state.allImages.filter((image) => image.id !== id);
        this.setState({allImages: newImages});
        this.getLayers();
        this.props.callbackDeleteFromMapping(id);
    }

    /**
     * Choses the current Layer and shows all Images within the Layer
     * @param layer The layerr, which you want to see
     * @param visible, Weather you opened or closed it it shows/removes all images
     */
    showImages(layer, visible) {
        if (visible) {
            this.setState({showLayer: ''});
        } else {
            this.setState({showLayer: layer});
        }
    }

    render() {
        // Variables
        const mouseOver = this.state.mouseOver;
        const layers = this.state.layers;
        const images = this.state.allImages;
        const showLayer = this.state.showLayer;
        const loading = this.state.load;
        let imgsOfLayer = [];
        let imgsVisible = false;

        // Styles
        const topStyle = {
            height: '25px',
        };
        const floatRightStyle = {
            float: 'right'
        };
        const loadingImgStyle = {
            zIndex: 100,
            position: 'fixed',
            top: '50%',
            left: '75%',
            width: '50px',
            height: '50px',
            marginTop: '-25px',
            marginLeft: '-25px',
        };
        const loadingDivStyle = {
            zIndex: 99,
            top: '10%',
            left: '50%',
            height: '90%',
            width: '50%',
            position: 'fixed',
            backgroundColor: 'rgba(255,255,255,0.7)',
        };

        // Component Parts
        const loadingImg = (
            <div style={loadingDivStyle}>
                <img src={loadingGif} style={loadingImgStyle}/>
            </div>
        );
        const displayLayerImages = layers.map((layer, index) => {
            imgsVisible = (layer.ebene === showLayer);
            if (imgsVisible) {
                imgsOfLayer = images.filter((img) => {
                    if (img.ebene === layer.ebene) {
                        return img;
                    }
                });
            }

            return <div key={index} className="list-group d-inline">
                <div className="list-group-item-action mt-2 mb-1 p-0 px-4 border rounded">
                    <span className="font-weight-normal text-secondary align-middle">Images: </span>
                    <span className="text-primary align-middle">{layer.ebene}</span>
                    <button
                        type="button"
                        className="btn btn-default p-0 m-0 shadow-none text-primary"
                        style={floatRightStyle}
                        onClick={this.showImages.bind(this, layer.ebene, imgsVisible)}
                    >
                        {(layer.ebene === showLayer) ? <KeyboardArrowDownIcon/> : <KeyboardArrowLeftIcon/>}
                    </button>
                </div>
                <div className="ml-4">
                    {imgsVisible ?
                      imgsOfLayer.map((elem, index) => {
                        return (
                            <div
                                className="list-group-item list-group-item-action p-0 pl-2 pr-2"
                                style={topStyle}
                                key={index}
                                onMouseEnter={() => this.setState({mouseOver: elem})}
                                onMouseLeave={() => this.setState({mouseOver: ''})}
                            >
                                <span className="align-middle">{elem.name}</span>
                                {(mouseOver === elem) ?
                                  <button
                                      type="button"
                                      onClick={() => this.handleDelete(elem)}
                                      className="btn btn-default p-0 text-danger text-center align-middle"
                                      style={{float: 'right', height: '25px'}}
                                  >
                                      <DeleteIcon className="align-middle"/>
                                  </button> : null }
                            </div>
                        )
                    }) : null}
                </div>
            </div>
        });

        return (
            <div>
                {loading ? loadingImg : null}
                {displayLayerImages}
            </div>
        );
    }
}

export default DeleteImage
