import React from "react";

class AddImage extends React.Component {
    constructor(props) {
        super(props);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    sendIcdToMapping(newImage) {
        this.props.callbackFromMapping(newImage);
    }

    handleFormSubmit(ebene, name, img) {
        let body = JSON.stringify({image: {ebene: ebene, name: name, img: img}});
        fetch('http://localhost:3000/api/v1/layers', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: body,
        }).then((image) => {
            this.addNewImage(layer)
        })
    }

    addNewImage(image) {
        this.sendIcdToMapping(image);
    }

    render() {
        let formFields = {};
        let addImage = (
            <form onSubmit={(e) => {
                this.handleFormSubmit(formFields.name.value, formFields.ebene.value, formFields.img.value);
                e.preventDefault();
            }}>
                <input ref={input => formFields.ebene = input} placeholder='Enter the name of the item'/>
                <input ref={input => formFields.name = input} placeholder='Enter the name of the image'/>
                <input ref={input => formFields.img = input} placeholder='Enter the image url'/>
                <button>Submit</button>
            </form>
        );
        return (
            <div>
                {addImage}
            </div>
        );
    }
}

export default AddImage