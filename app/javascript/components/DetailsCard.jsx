import React from 'react';
import CloseIcon from "@material-ui/icons/Close";

/**
 * DetailsCard displays an ICD given via props in a viewable fashion
 * @author Aaron Saegesser
 */
class DetailsCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showingIcdId: 0,
            selectedIcd: this.props.selectedIcd
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

    saveChanges(event) {
        let body = JSON.stringify({
            icd: {
                id: this.state.selectedIcd.id,
                code: this.state.selectedIcd.code,
                version: this.state.selectedIcd.version,
                text_de: this.state.selectedIcd.text_de,
                text_fr: this.state.selectedIcd.text_fr,
                text_it: this.state.selectedIcd.text_it,
                annotationen: this.state.selectedIcd.annotationen,
                kapitel: this.state.selectedIcd.kapitel
            }
        });
        console.log(body);
        event.preventDefault();
        /*
        fetch('http://localhost:3000/api/v1/maps', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: body,
        }).then((response) => {return response.json()})
            .then((map)=>{this.addNewMap(map)});
        event.preventDefault();
         */
    }

    closeDetailsCard() {
        this.props.callbackFromMainUIClose();
    }

    render() {
        let selectedIcd = this.props.selectedIcd;
        const editable = this.props.editable;
        const searchVisible = this.props.searchDisplayed;

        const empty = (<></>);

        const buttonStyle = {
            float: 'right'
        }
        const detailsWithSearchStyle = {
            height: '41vh',
            overflow: 'auto',
            marginBottom: '2vh'
        }
        const detailsWithoutSearchStyle = {
            overflow: 'auto',
            marginBottom: '2vh'
        }

        return (
            <div style={searchVisible ? detailsWithSearchStyle : detailsWithoutSearchStyle}>
                <div className="card">
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
                    {editable ?
                        <form>
                            <input type="submit" value="save changes" onClick={this.saveChanges.bind(this)}/>
                        </form>
                        : empty
                    }
                </div>
            </div>
        )
    }
}

export default DetailsCard;
