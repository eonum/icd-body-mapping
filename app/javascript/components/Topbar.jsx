import React from 'react';
import { Form, FormControl } from "react-bootstrap";
import logo from '../../assets/images/eonum_logo.png';
import SearchIcon from '@material-ui/icons/Search';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import EditIcon from '@material-ui/icons/Edit';

/**
 * The Topbar contains the searchbar and header and is responsible for the searching.
 * Possible search results are handed over to parent via callback.
 * @author Aaron Saegesser, Linn Haeffner
 */
class Topbar extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            term: '',
			viewAll: this.props.viewAll,
            activeLanguage: 'de'
        };
    }
	
	componentDidUpdate(prevProps) {
		if (this.props.viewAll !== prevProps.viewAll) {
			this.setViewAll(this.props.viewAll);
		}
	}

    /**
     * Gets the search term and sends it to MainUI
     * via callback function
     */
    setSearchTerm(term) {
        this.setState({
			term: term
		});
		
		this.setViewAll(false);
        this.props.callbackFromMainUISearch(term);
    }
	
	setViewAll(viewAll) {
		this.setState({
			viewAll: viewAll
		});
		event.preventDefault();
		this.props.callbackFromMainUIViewAll(viewAll);
	}

    setEditMode(edit) {
        this.props.callbackFromMainUIEdit(edit);
    }

    setLanguage(lang) {
        this.setState({
            activeLanguage: lang
        });
        this.props.callbackFromMainUISetLanguage(lang);
    }

    render() {
        const headerStyle = {
            fontSize: '24px'
        };
        const buttonStyle = {
            width: '60px'
        };

        const editButton = (
            <button
                type="button"
                className="btn btn-default text-white"
                data-toggle="tooltip"
                data-placement="bottom"
                title="enter edit mode"
                style={buttonStyle}
                onClick={this.setEditMode.bind(this, true)}
            >
                <EditIcon/>
            </button>
        );
        const exitEditButton = (
            <button
                type="button"
                className="btn btn-default text-white"
                data-toggle="tooltip"
                data-placement="bottom"
                title="exit edit mode"
                style={buttonStyle}
                onClick={this.setEditMode.bind(this, false)}
            >
                <ExitToAppIcon/>
            </button>
        );
        const languages = {
            german: 'de',
            french: 'fr',
            italian: 'it'
        };
        const dropdown = (
            <div className="dropdown mr-1">
                <button
                    className="btn btn-default dropdown-toggle text-white"
                    type="button"
                    style={buttonStyle}
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                >
                    {this.state.activeLanguage}
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <div className="dropdown-item" onClick={this.setLanguage.bind(this, languages.german)}>{languages.german}</div>
                    <div className="dropdown-item" onClick={this.setLanguage.bind(this, languages.french)}>{languages.french}</div>
                    <div className="dropdown-item" onClick={this.setLanguage.bind(this, languages.italian)}>{languages.italian}</div>
                </div>
            </div>
        );

        return (
            <div className="navbar navbar-light bg-primary">
                <Form>
                    <FormControl
                        onChange={event => {this.setSearchTerm(event.target.value)}}
                        onKeyDown={event => {if (event.key === 'Enter') {this.setViewAll(true)}}}
                        type="text"
                        placeholder="Search..."
                        className="mr-sm-2"
                    />
                </Form>
                <button
                    type="button"
                    className="btn btn-default text-white ml-2"
                    onClick={event => {if (this.state.term !== '') {this.setViewAll(true)}}}
                >
                    <SearchIcon/>
                </button>
                <h1 className="navbar-brand mx-auto text-white" style={headerStyle}>
                    ICD Mapping -
                    <img className="ml-2" src={logo} alt="eonum" height="16px" />
                </h1>
                {dropdown}
                {this.props.editable ? exitEditButton : editButton}
            </div>
        )
    }
}

export default Topbar;