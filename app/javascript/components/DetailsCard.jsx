import React from 'react';
import CloseIcon from "@material-ui/icons/Close";
import NewMaps from "./NewMaps";

/**
 * DetailsCard displays an ICD given via props in a viewable fashion
 * @author Aaron Saegesser
 */
class DetailsCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showingIcdId: 0
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    stateIdSet() {
        this.setState({showingIcdId: this.props.selectedIcd.id});
    }

    handleSubmit(event) {
        this.props.callbackFromMainUI(this.state.showingIcdId);
        event.preventDefault();
    }

    closeDetailsCard() {
        this.props.callbackFromMainUIClose();
    }

    render() {
        let selectedIcd = this.props.selectedIcd;
        let selectedLayer = this.props.selectedLayer;

        const noIcd = (<></>);

        const buttonStyle = {
            float: 'right'
        }

        return (
            <div className="card">
                {selectedLayer}
                {(selectedIcd.id !== 0 && selectedLayer !== '') ? <NewMaps icd_id={selectedIcd.id} layer_id={selectedLayer}/> : noIcd}
                <div className="card-header bg-primary">
                    <div className="overlay bg-primary" />
                    <a type="button"
                       className="btn btn-light"
                       style={buttonStyle}
                       onClick={this.closeDetailsCard.bind(this)}>
                        <CloseIcon />
                    </a>
                    <h1 className="card-title text-white">
                        {selectedIcd.code}
                    </h1>
                    <form onSubmit={this.handleSubmit}>
                        <input type="submit" value="Show" onClick={this.stateIdSet.bind(this)}/>
                    </form>
                </div>
                <div className="card m-2 mt-4 mr-4 ml-4 border-0">
                    <h5 className="card-subtitle">German</h5>
                    <div
                        className="border-top"
                        dangerouslySetInnerHTML={{
                            __html: `${selectedIcd.text_de}`
                        }}
                    />
                </div>
                <div className="card m-2 mr-4 ml-4 border-0">
                    <h5 className="card-subtitle">French</h5>
                    <div
                        className="border-top"
                        dangerouslySetInnerHTML={{
                            __html: `${selectedIcd.text_fr}`
                        }}
                    />
                </div>
                <div className="card mt-2 ml-4 mr-4 mb-3 border-0">
                    <h5 className="card-subtitle">Italian</h5>
                    <div
                        className="border-top"
                        dangerouslySetInnerHTML={{
                            __html: `${selectedIcd.text_it}`
                        }}
                    />
                </div>
            </div>
        )
    }
}

export default DetailsCard;
