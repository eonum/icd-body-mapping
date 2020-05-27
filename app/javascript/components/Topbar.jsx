import React from 'react';
import {FormControl} from "react-bootstrap";
import logo from '../../assets/images/eonum_logo.png';
import SearchIcon from '@material-ui/icons/Search';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import EditIcon from '@material-ui/icons/Edit';
import HomeIcon from '@material-ui/icons/Home';

/**
 * The Topbar contains the home button, searchbar, header, language selection
 * and the switch button for the editable view
 * Topbar doesn't do the search itself, it just sends the searchterm to
 * @SearchCard which does the searching
 * @author Aaron Saegesser, Linn Haeffner, Marius Asadauskas, Joshua Felder
 */
class Topbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
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

    /**
     * Resets the UI by callback to MainUI
     */
    setUIDefault() {
        this.props.callbackFromMainUIresetUI();
        this.setState({
            term: '',
            viewAll: this.props.viewAll,
        });
        this.searchForm.reset();
    }


    /**
     * Gets the search term and a boolean viewAll
     * (true - if all results should be displayed)
     * and sends it to MainUI via callback function
     * @param term    Searchterm-string
     * @param viewAll Boolean if all results should be displayed
     *                or just the first 25 (faster loading)
     */
    setSearchTerm(term, viewAll) {
        if (term !== '') {
            this.props.callbackFromMainUIViewAll(viewAll);
            this.setState({
                term: term,
                viewAll: viewAll
            });

            if (this.timeout) {
                clearTimeout(this.timeout);
            }
            this.timeout = setTimeout(() => {
                this.props.callbackFromMainUISearch(term);
            }, 300);
        }
        event.preventDefault();
    }

    setEditMode(edit) {
        this.props.callbackFromMainUIEdit(edit);
    }

    setLanguage(lang) {
        this.setState({activeLanguage: lang});
        this.props.callbackFromMainUISetLanguage(lang);
    }

    render() {
        // Styles
        const headerStyle = {
            fontSize: '24px'
        };
        const buttonStyle = {
            width: '60px'
        };
        const dropdownMenuStyle = {
            maxWidth: '3rem'
        };

        // Buttons
        const homeButton = (
            <button
                type="button"
                className="btn btn-default p-0 my-auto ml-2 shadow-none text-white"
                onClick={this.setUIDefault.bind(this)}
            >
                <HomeIcon className="ml-2"/>
                <img className="ml-2" src={logo} alt="eonum" height="20px"/>
            </button>
        );
        const searchButton = (
            <button
                type="button"
                className="btn btn-default text-white ml-2"
                onClick={event => {
                    if (this.state.term !== '') {
                        this.setSearchTerm(this.state.term, true)
                    }
                }}
            >
                <SearchIcon/>
            </button>
        );
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

        const searchForm = (
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
        );
        const header = (
            <button
                type="button"
                className="btn btn-default text-white navbar-brand mx-auto"
                style={headerStyle}
                onClick={this.setUIDefault.bind(this)}
            >
                ICD Mapping
            </button>
        );

        // Languages and Dropdown
        const languages = {
            german: 'de',
            french: 'fr',
            italian: 'it'
        };
        const dropdownLang = (
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
                <div
                    className="dropdown-menu"
                    style={dropdownMenuStyle}
                    aria-labelledby="dropdownMenuButton"
                >
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
                <div className="col-2 navbar navbar-light bg-dark text-left">
                    {homeButton}
                </div>
                <div className="col-10 navbar navbar-light bg-primary">
                    {searchForm}
                    {searchButton}
                    {header}
                    {dropdownLang}
                    {this.props.editable ? exitEditButton : editButton}
                </div>
            </div>
        )
    }
}

export default Topbar;
