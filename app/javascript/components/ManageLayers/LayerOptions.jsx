import React from "react";
import AddImage from "./AddImage";
import DeleteImage from "./DeleteImage";
import AddIcon from '@material-ui/icons/Add';

class LayerOptions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            add: false,
            isMounted: false
        }
    }

    componentDidMount() {
        this.setState({isMounted: true});
    }

    componentWillUnmount() {
        this.setState({isMounted: false});
    }

    callbackallImages = (layer) => {
        this.sendIcdToMapping(layer);
        this.setState({
            add: false,
        })
    };

    sendIcdToMapping(newImage) {
        this.props.callbackFromMapping(newImage);
    }

    addView() {
        this.setState({
            add: true,
        });
    }

    render() {
        const floatRightStyle = {float: 'right'}
        const addButton = (
            <button
                type="button"
                className="btn btn-primary p-0 text-center"
                style={floatRightStyle}
                data-toggle="tooltip"
                data-placement="bottom"
                title="add new image"
                onClick={this.addView.bind(this)}
            >
                <AddIcon/>
            </button>
        );

        return (
            <div className="p-4">
                {this.state.add ?
                    <AddImage
                        callbackFromMapping={this.callbackallImages}
                        style="z-index: 5"
                    />
                    : addButton }
                <DeleteImage style="z-index: 5"/>
            </div>
        )
    }
}

export default LayerOptions
