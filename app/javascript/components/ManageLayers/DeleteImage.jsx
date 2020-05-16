import React from "react";
import $ from "jquery";

class DeleteImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allImages: []
        };
        this.handleDelete = this.handleDelete.bind(this);
        this.deleteImage = this.deleteImage.bind(this);
    }
    componentDidMount() {
        $.getJSON('/api/v1/layers')
            .then(response => this.setState({allImages: response}));
    }

    handleDelete(id){
        fetch(`http://localhost:3000/api/v1/layers/${id}`,
            {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'}
            }).then((response) => {
            this.deleteImage(id)
        })
    }

    deleteImage(id){
        let newImages = this.state.maps.filter((image) => image.id !== id);
        this.setState({allImages: newImages});
    }

    render() {
        let images = this.state.allImages.map((elem, index) => {
            return(
                <div key={index}>
                    {elem.name}
                    <div onClick={() => this.handleDelete(elem.id)} style={{float: 'right'}}>X</div>
                </div>
            )
        });
        return(
            <div>
                {images}
            </div>
        );
    }
}
export default DeleteImage