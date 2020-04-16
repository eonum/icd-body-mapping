import React from 'react';

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

    render() {
        let selectedIcd = this.props.selectedIcd;

        return (
            <div className="card">
                <div className="card-header">
                    <div className="overlay bg-dark" />
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
