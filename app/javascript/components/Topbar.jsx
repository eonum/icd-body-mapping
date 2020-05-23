import React from 'react';
import {FormControl} from "react-bootstrap";
import logo from '../../assets/images/eonum_logo.png';
import SearchIcon from '@material-ui/icons/Search';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import EditIcon from '@material-ui/icons/Edit';
import HomeIcon from '@material-ui/icons/Home';

/**
 * The Topbar contains the searchbar and header and is responsible for the searching.
 * Possible search results are handed over to parent via callback.
 * @author Aaron Saegesser, Linn Haeffner, Marius Asadauskas, Joshua Felder
 */
class Topbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            query: '',
            term: '',
            viewAll: this.props.viewAll,
            activeLanguage: 'de',

        };
        this.timeout = 0;
    }

    componentDidUpdate(prevProps) {
        if (this.props.viewAll !== prevProps.viewAll
          && this.props.searchDisplayed !== prevProps.searchDisplayed
          && this.props.searchDisplayed === true) {
            this.setSearchTerm(this.state.term, this.props.viewAll);
        }
    }

    setUIDefault() {
        this.props.callbackFromMainUIresetUI();
        this.setState({
            query: '',
            term: '',
            viewAll: this.props.viewAll,
        });
        this.searchForm.reset();
    }


    /**
     * Gets the search term and sends it to MainUI
     * via callback function
     */

    setSearchTerm(term, viewAll) {
        this.props.callbackFromMainUIViewAll(viewAll);
        this.setState({
            term: term,
            viewAll: viewAll
        });

        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.props.callbackFromMainUISearch(term);
        }, 300);
        event.preventDefault();
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
        const dropdownMenuStyle = {
            maxWidth: '3rem'
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
            <div className="btn-group dropleft mr-1">
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
                <div className="dropdown-menu" style={dropdownMenuStyle} aria-labelledby="dropdownMenuButton">
                    <div className="dropdown-item" onClick={this.setLanguage.bind(this, languages.german)}>
                        {languages.german}
                    </div>
                    <div className="dropdown-item" onClick={this.setLanguage.bind(this, languages.french)}>
                        {languages.french}
                    </div>
                    <div className="dropdown-item" onClick={this.setLanguage.bind(this, languages.italian)}>
                        {languages.italian}
                    </div>
                </div>
            </div>
        );

        return (
            <div className="row">
                <div className="col-2 navbar navbar-light bg-dark text-center">
                    <button
                        type="button"
                        className="btn btn-default shadow-none text-white ml-3"
                        onClick={this.setUIDefault.bind(this)}
                    >
                        <HomeIcon/>
                        <img className="ml-4" src={logo} alt="eonum" height="20px"/>
                    </button>
                </div>
                <div className="col-10 navbar navbar-light bg-primary">
                    <form ref={form => this.searchForm = form}>
                        <FormControl
                            onChange={event => {
                                this.setSearchTerm(event.target.value, false)
                            }}
                            onKeyDown={event => {
                                if (event.key === 'Enter') {
                                    this.setSearchTerm(event.target.value, true)
                                }
                            }}
                            type="text"
                            placeholder='Search...'
                            className="mr-sm-2"
                        />
                    </form>
                    <button
                        type="button"
                        className="btn btn-default text-white ml-2"
                        onClick={event => {
                            this.setSearchTerm(this.state.term, true)
                        }}
                    >
                        <SearchIcon/>
                    </button>
                    <button
                        type="button"
                        className="btn btn-default text-white navbar-brand mx-auto"
                        style={headerStyle}
                        onClick={this.setUIDefault.bind(this)}
                    >
                        ICD Mapping
                    </button>
                    {dropdown}
                    {this.props.editable ? exitEditButton : editButton}
                </div>
            </div>
        )
    }
}

export default Topbar;
