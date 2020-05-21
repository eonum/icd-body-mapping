import React from "react";
import $ from "jquery";
import DeleteIcon from '@material-ui/icons/Delete';

class DeleteImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allImages: [],
            mouseOver: '',
        };
        this.handleDelete = this.handleDelete.bind(this);
        this.deleteImage = this.deleteImage.bind(this);
    }

    componentDidMount() {
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

    componentDidUpdate(prevProps) {
        if (this.props.layer !== prevProps.layer){
            setTimeout(() => {
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
            });
        }
    }

    componentWillUnmount() {
    }

    handleDelete(elem) {
        const id = elem.id;
        const deletion = confirm('Do you want to delete ' + elem.name);

        if (deletion) {
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

    deleteImage(id) {
        let newImages = this.state.allImages.filter((image) => image.id !== id);
        this.setState({allImages: newImages});
        this.props.callbackDeleteFromMapping(id);
    }

    render() {
        const mouseOver = this.state.mouseOver;
        let images = this.state.allImages.map((elem, index) => {
            return (
                <div
                    className="row list-group-item list-group-item-action ml-2 mr-2 p-0 pl-2 pr-2"
                    key={index}
                    onMouseEnter={() => this.setState({mouseOver: elem})}
                    onMouseLeave={() => this.setState({mouseOver: ''})}
                >
                    {elem.name}
                    {(mouseOver === elem) ?
                      <button
                          type="button"
                          onClick={() => this.handleDelete(elem)}
                          className="btn btn-default p-0 text-danger text-center align-middle"
                          style={{float: 'right'}}
                      >
                          <DeleteIcon />
                      </button> : null }
                </div>
            )
        });
        return (
            <div>
                {images}
            </div>
        );
    }
}

export default DeleteImage
