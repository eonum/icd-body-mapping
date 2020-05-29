import React from "react";
import loadingGif from '../../../assets/images/Preloader_2.gif';
/**
 * The AddImage Component allows the User to add his own Images, as to expand the Mapping
 * This is done Through 3 Input fields that appear, once the plus is clicked
 */
class AddImage extends React.Component {
    constructor(props) {
        super(props);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.state = {
            load: false,
        };
    }

    /**
     * The handleFormSubmit Method takes the Input from the 3 fields and makes
     * a post request to the Backend. It then passes the response to Mapping and
     * DeleteImages, so that they could update their collection.
     */
    handleFormSubmit(ebene, name, img) {
        let body = JSON.stringify({layer: {ebene: ebene, name: name, img: img}});

        this.setState({load: true});
        fetch('http://localhost:3000/api/v1/layers', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: body,
        }).then((layer) => {
            if (layer.ok){
                this.props.callbackFromMapping(layer);
                this.setState({load: false});
            }
        })
    }

    /**
     * This Method prevents the standard reaction upon enter
     * Since there are 3 Fields we diasable submit on enter,
     * since it would cause Problems
     */
    handleKeyDown(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    }

    render() {
        // Variables
        let formFields = {};
        const loading = this.state.load;

        // Styles
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
        const addForm = (
            <form
                onSubmit={(e) => {
                    this.handleFormSubmit(formFields.ebene.value, formFields.name.value, formFields.img.value);
                    e.preventDefault();
                }}
                onKeyDown={e => this.handleKeyDown(e)}
                className="form-group"
            >
                <input
                    ref={input => formFields.ebene = input}
                    placeholder='Enter the layer E.g. Ohr'
                    className="form-control"
                />
                <input
                    ref={input => formFields.name = input}
                    placeholder='Enter the name E.g. Auricula'
                    className="form-control"
                />
                <input
                    ref={input => formFields.img = input}
                    placeholder='Enter the image url'
                    className="form-control"
                />
                <button className="btn btn-primary">
                    Submit
                </button>
            </form>
        );

        return (
            <div>
                {loading ? loadingImg : null}
                {addForm}
            </div>
        );
    }
}
export default AddImage
