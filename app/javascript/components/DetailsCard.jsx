import React from 'react';
import CloseIcon from "@material-ui/icons/Close";
import {Form, FormControl} from "react-bootstrap";
import NewMaps from "./NewMaps";

/**
 * DetailsCard displays an ICD given via props in a viewable fashion
 * @author Aaron Saegesser
 */
class DetailsCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showingIcdId: 0,
            selectedIcd: this.props.selectedIcd,
            annotationen: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate(prevProps) {
        if(this.props.selectedLayer !== prevProps.selectedLayer)
        {
            if (this.props.selectedLayer === true || this.props.selectedLayer === false){
                this.setState({showingIcdId: 0});
                this.props.callbackFromMainUI(0);
            }
        }
    }

    stateIdSet() {
        this.setState({showingIcdId: this.props.selectedIcd.id});
    }

    handleSubmit(event) {
        this.props.callbackFromMainUI(this.props.selectedIcd.id);
        event.preventDefault();
    }

    saveChanges(event) {
		event.preventDefault();
        let body = JSON.stringify({
            icd: {
                id: this.state.selectedIcd.id,
                code: this.state.selectedIcd.code,
                version: this.state.selectedIcd.version,
                text_de: this.state.selectedIcd.text_de,
                text_fr: this.state.selectedIcd.text_fr,
                text_it: this.state.selectedIcd.text_it,
                annotationen: this.state.annotationen,
                kapitel: this.state.selectedIcd.kapitel
            }
        });

        fetch('http://localhost:3000/api/v1/icds/' + this.state.selectedIcd.id, {
            method: 'PUT',
            headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
            body: body,
        }).then((response) => {
			return response.json()
		});

        alert('saved following annotations: ' + this.state.annotationen);
    }

    closeDetailsCard() {
        this.props.callbackFromMainUIClose();
    }

    render() {
        let selectedIcd = this.props.selectedIcd;
        const editable = this.props.editable;
        const searchVisible = this.props.searchDisplayed;
        const layer_id = this.props.selectedLayer.id;
        let lang = this.props.language;

        const empty = (<div/>);

        const buttonStyle = {
            float: 'right'
        };
        const detailsWithSearchStyle = {
            height: '34vh',
            overflow: 'auto',
            marginBottom: '2vh'
        };
        const detailsWithoutSearchStyle = {
            overflow: 'auto',
            marginBottom: '2vh'
        };

        const editView = (
            <div className="card mt-2 ml-4 mr-4 mb-3 border-0">
                <h5 className="card-subtitle text-primary">Annotations</h5>
                <Form>
                    <FormControl
                        onChange={event => {this.setState({annotationen: event.target.value})}}
						onKeyDown={event => {if (event.key === 'Enter') {this.saveChanges.bind(this)}}}
                        type="text"
						key={this.props.selectedIcd.annotationen}
                        defaultValue={this.props.selectedIcd.annotationen}
                        className="mr-sm-2"
                    />
                </Form>
                <div className="mt-4 border-top border-primary" />
                <div className="row">
                    <div className="col-4 mt-2">
                        <Form className="float-left">
                            <input
                                type="submit"
                                className="btn btn-light btn-outline-primary"
                                value="save"
                                onClick={this.saveChanges.bind(this)}
                            />
                        </Form>
                    </div>
                    <div className="col-4 mt-2">
                        <NewMaps
                            icd_id={selectedIcd.id}
                            icd_ids={[]}
                            layer_id={layer_id}
                        />
                    </div>
                    <div className="col-4 mt-2">
                        <Form className="float-right" onSubmit={this.handleSubmit}>
                            <input
                                type="submit"
                                className="btn btn-primary"
                                value="show"
                                onClick={this.stateIdSet.bind(this)}
                            />
                        </Form>
                    </div>
                </div>
            </div>
        );
        const annotations = (
            <div className="card mb-3 mt-2 mr-4 ml-4 border-0">
                <h5 className="card-subtitle">Annotations</h5>
                <div
                    className="border-top"
                    dangerouslySetInnerHTML={{
                        __html: `${selectedIcd.annotationen}`
                    }}
                />
            </div>
        );
        const uneditableView = (
            <div>
                {selectedIcd.annotationen !== null ? annotations : empty}
                <div className="mt-2 ml-4 mr-4 mb-3 border-top border-primary">
                    <Form className="mt-2 mb-4 float-right" onSubmit={this.handleSubmit}>
                        <input
                            type="submit"
                            className="btn btn-primary"
                            value="show"
                            onClick={this.stateIdSet.bind(this)}
                        />
                    </Form>
                </div>
            </div>
        );
        const ger = (
            <div className="card m-2 mt-4 mr-4 ml-4 border-0">
                <h5 className="card-subtitle">German</h5>
                <div
                    className="border-top"
                    dangerouslySetInnerHTML={{
                        __html: `${selectedIcd.text_de}`
                    }}
                />
            </div>
        );
        const fr = (
            <div className="card m-2 mt-4 mr-4 ml-4 border-0">
                <h5 className="card-subtitle">French</h5>
                <div
                    className="border-top"
                    dangerouslySetInnerHTML={{
                        __html: `${selectedIcd.text_fr}`
                    }}
                />
            </div>
        );
        const it = (
            <div className="card m-2 mt-4 mr-4 ml-4 border-0">
                <h5 className="card-subtitle">Italian</h5>
                <div
                    className="border-top"
                    dangerouslySetInnerHTML={{
                        __html: `${selectedIcd.text_it}`
                    }}
                />
            </div>
        );

        return (
            <div style={searchVisible ? detailsWithSearchStyle : detailsWithoutSearchStyle}>
                <div className="card">
                    <div className="card-header bg-primary">
                        <div className="overlay bg-primary" />
                        <button type="button"
                           className="btn btn-default btn-sm text-right text-white"
                           style={buttonStyle}
                           onClick={this.closeDetailsCard.bind(this)}>
                            <CloseIcon />
                        </button>
                        <h1 className="card-title text-white ml-2 mt-1">
                            {selectedIcd.code}
                        </h1>
                    </div>
                    {lang === 'de' ? ger : empty}
                    {lang === 'fr' ? fr : empty}
                    {lang === 'it' ? it : empty}
                    <div>
                        {editable ? editView : uneditableView}
                    </div>
                </div>
            </div>
        )
    }
}

export default DetailsCard;
