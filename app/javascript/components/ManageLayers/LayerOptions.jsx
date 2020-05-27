import React from "react";
import AddImage from "./AddImage";
import DeleteImage from "./DeleteImage";
import AddIcon from '@material-ui/icons/Add';

class LayerOptions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            add: false,
            isMounted: false,
            image: '',
        }
    }

    componentDidMount() {
        this.setState({isMounted: true});
    }

    componentWillUnmount() {
        this.setState({isMounted: false});
    }

    callbackallImages = (image) => {
        this.props.callbackFromMapping(image);
        this.setState({
            add: false,
            image: image
        })
    };

    addView() {
        this.setState({
            add: true,
        });
    }

    render() {
        const addButton = (
            <button
                type="button"
                className="btn btn-primary p-0 text-center"
                data-toggle="tooltip"
                data-placement="bottom"
                title="add new image"
                onClick={this.addView.bind(this)}
            >
                <AddIcon/>
            </button>
        );

        return (
            <div className="p-2 pr-4">
                <div className="m-0">
                    {this.state.add ?
                        <AddImage
                            callbackFromMapping={this.callbackallImages}
                            style="z-index: 5"
                        />
                        :
                        addButton
                    }
                </div>
                <DeleteImage style="z-index: 5" callbackDeleteFromMapping={this.props.callbackDeleteFromMapping} image={this.state.image}/>
            </div>
        )
    }
}

export default LayerOptions
