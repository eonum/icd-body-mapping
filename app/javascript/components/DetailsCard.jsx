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
            showingIcd: 'show',
            selectedIcd: this.props.selectedIcd,
            annotationen: ''
        };
    }

    componentDidUpdate(prevProps) {
        if(this.props.selectedIcd !== prevProps.selectedIcd) {
            this.props.callbackFromMainUI(this.props.selectedIcd.id);
        }
    }

    componentDidMount() {
        this.props.callbackFromMainUI(this.props.selectedIcd.id);
    }

    callbackMaps = (Map) => {
        this.sendIcdToMainUi(Map);
    };

    sendIcdToMainUi(Map) {
        this.props.callbackFromMainUIMaps(Map);
    }

    stateIdSet() {
        this.setState({showingIcdId: this.props.selectedIcd.id});
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

        this.props.callbackFromMainUIReloadIcds();

        alert('saved following annotations: ' + this.state.annotationen);
    }

    closeDetailsCard() {
        this.props.callbackFromMainUIClose();
        this.props.callbackFromMainUI(0);
    }

    render() {
        let selectedIcd = this.props.selectedIcd;
        const editable = this.props.editable;
        const searchVisible = this.props.searchDisplayed;
        const selectedLayer = this.props.selectedLayer;
        let lang = this.props.language;

        const empty = (<div/>);

        const buttonStyle = {
            float: 'right'
        };
        const detailsWithSearchStyle = {
            height: '34vh',
            overflow: 'auto',
        };
        const detailsWithoutSearchStyle = {
            overflow: 'auto',
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
                                className="btn btn-primary"
                                value="save"
                                onClick={this.saveChanges.bind(this)}
                            />
                        </Form>
                    </div>
                    <div className="col-4 mt-2">
                        <NewMaps
                            icd_id={selectedIcd.id}
                            icd_ids={[]}
                            selectedLayer={selectedLayer}
                            callbackFromDetailsCard={this.callbackMaps}
                        />
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
                {(selectedIcd.annotationen !== null && selectedIcd.annotationen !== '') ? annotations : empty}
            </div>
        );
        const ger = (
            <div
                className="border-top"
                dangerouslySetInnerHTML={{
                    __html: `${selectedIcd.text_de}`
                }}
            />
        );
        const fr = (
            <div
                className="border-top"
                dangerouslySetInnerHTML={{
                    __html: `${selectedIcd.text_fr}`
                }}
            />
        );
        const it = (
            <div
                className="border-top"
                dangerouslySetInnerHTML={{
                    __html: `${selectedIcd.text_it}`
                }}
            />
        );

        return (
            <div style={searchVisible ? detailsWithSearchStyle : detailsWithoutSearchStyle}>
                <div className="card mb-2">
                    <div className="card-header bg-primary">
                        <div className="overlay bg-primary" />
                        <button type="button"
                           className="btn btn-default btn-sm text-right text-white ml-4"
                           style={buttonStyle}
                           onClick={this.closeDetailsCard.bind(this)}>
                            <CloseIcon />
                        </button>
                        <h1 className="card-title text-white ml-2 mt-1">
                            {selectedIcd.code}
                        </h1>
                    </div>
                    <div className="card m-2 mt-4 mr-4 ml-4 pb-1 border-0">
                        <h5 className="card-subtitle">Description</h5>
                        {lang === 'de' ? ger : empty}
                        {lang === 'fr' ? fr : empty}
                        {lang === 'it' ? it : empty}
                    </div>
                    <div>
                        {editable ? editView : uneditableView}
                    </div>
                </div>
            </div>
        )
    }
}

export default DetailsCard;
