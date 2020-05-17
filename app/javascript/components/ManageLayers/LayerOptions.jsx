import React from "react";
import AddImage from "./AddImage";
import DeleteImage from "./DeleteImage";

class LayerOptions extends React.Component {
    constructor(props) {
        super(props);
        this.toggleHidden = this.toggleHidden.bind(this);
        this.state = {
            isVisible: false
        }
    }

    callbackallImages = (layer) => {
        this.sendIcdToMapping(layer);
    };

    sendIcdToMapping(newImage) {
        this.props.callbackFromMapping(newImage);
    }

    toggleHidden () {
        this.setState({
            isVisible: !this.state.isVisible
        })
    }

    render() {
        return (
            <div className='analytics' onMouseEnter={this.toggleHidden} onMouseLeave={this.toggleHidden}>

                { !this.state.isVisible ? <div>Settings</div> : null }
                <div>
                    { this.state.isVisible ? <AddImage callbackFromMapping={this.callbackallImages} style="z-index: 5"/> : null }
                    { this.state.isVisible ? <DeleteImage style="z-index: 5"/> : null }
                </div>
            </div>
        )
    }
}
export default LayerOptions