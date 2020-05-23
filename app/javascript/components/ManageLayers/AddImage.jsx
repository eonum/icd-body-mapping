import React from "react";

class AddImage extends React.Component {
    constructor(props) {
        super(props);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    handleFormSubmit(ebene, name, img) {
        let body = JSON.stringify({layer: {ebene: ebene, name: name, img: img}});
        fetch('http://localhost:3000/api/v1/layers', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: body,
        }).then((layer) => {
            if (layer.ok){
                this.addNewImage(layer);
            }
        })
    }

    addNewImage(image) {
        this.props.callbackFromMapping(image);
    }

    handleKeyDown(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    }

    render() {
        let formFields = {};
        return (
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
    }
}

export default AddImage
