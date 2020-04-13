import React from 'react';
import {IconButton} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

/**
 * The Sidebar gets the database from backend and renders
 * the ICD's according to the hierarchy of the ICD catalogue
 * @author Aaron Saegesser
 */
class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.allICDs = [];
        this.chapterICDs = [];
        this.state = {
            icds: [],
            icdSelection: [],
            filtered: false,
            icdCodelength: 3,
            term: ''
        };
    }

    componentDidMount() {
        const url = "/icds";
        fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response wasn't ok.");
            })
            .then(async response => this.storeDatabase(await response))
            .catch(() => this.props.history.push("/"));
    }

    /**
     * Takes backend response and calls methods to store the DB
     * in the frontend for further processing
     * @param response
     */
    storeDatabase(response) {
        this.setState({ icds: response.sort() });
        this.setIcdDatabaseStorage(response);
        this.readOutChapters(response);
    }

    setIcdDatabaseStorage(icds) {
        this.allICDs = icds;
    }

    /**
     * Reads and stores first ICD of every chapter
     * (which will then be used by renderer to display the chapters)
     * @param icds
     */
    readOutChapters(icds) {
        let chapterTemp;
        this.chapterICDs = icds.map((icd) => {
            if (icd.kapitel !== chapterTemp) {
                chapterTemp = icd.kapitel;
                return icd;
            } else {
                return 0;
            }
        });

        this.chapterICDs = this.chapterICDs.filter((value) => {
            return value !== 0;
        });

        this.chapterICDs.sort((icd1, icd2) => {
            const chap1 = icd1.kapitel;
            const chap2 = icd2.kapitel;

            let comparison = 0;
            if (chap1 > chap2) {
                comparison = 1;
            } else if (chap1 < chap2) {
                comparison = -1;
            }
            return comparison;
        });

        this.setState({
            icdSelection: this.chapterICDs
        });
    }

    /**
     * Filters ICD's according to the chapter of a given ICD
     * and stores the matching cases in a sorted array in the state
     * @param icd
     */
    filterIcdsByChapter(icd) {
        const ICDs = this.allICDs;
        const selectedChapter = icd.kapitel;
        const codelength = 3;

        let selection = ICDs.map((icd) => {
            if (icd.kapitel === selectedChapter) {
                return icd;
            } else {
                return 0;
            }
        });

        selection = selection.filter((value) => {
            return value !== 0;
        });

        this.setState({
            icds: selection.sort(),
            filtered: true,
            icdCodelength: codelength,
        });
    }

    /**
     * Filters ICD's according to the code of a given ICD
     * and stores the filtered and sorted array in the state
     * @param state
     * @param icd
     */
    filterIcdsByIcdcode(state, icd) {
        const ICDs = state.icds;
        const icdCode = icd.code.toString();
        let codelength;

        switch (icdCode.length) {
            case 1:
                codelength = 3;
                break;
            case 3:
                codelength = 5;
                break;
            case 5:
                codelength = 6;
                break;
        }

        let selection = ICDs.map((icd) => {
            if (icd.code.toString().includes(icdCode)
                && icd.code.toString().length === codelength) {
                return icd;
            } else {
                return 0;
            }
        });

        selection = selection.filter((value) => {
            return value !== 0;
        });

        this.setState({
            icdSelection: selection.sort(),
            filtered: true,
            icdCodelength: codelength,
            term: icdCode
        });

        this.sendIcdToMainUI(icd);
    }

    /**
     * Gets ICD's from next superior level in hierarchy via shortening
     * the search term and searching the ICD's array
     */
    stepBackHierarchy() {
        const state = this.state;
        let ICDs = state.icds;

        let term = state.term;
        let filtered = true;
        let codelength;

        if (term.toString().length === 0) {
            ICDs = this.allICDs;
            filtered = false;
            codelength = 3;
        } else if (term.toString().length === 3) {
            term = '';
            codelength = 3;
        } else if (term.toString().length === 5) {
            term = term.toString().substring(0, 3);
            codelength = 5;
        } else if (term.toString().length === 6) {
            term = term.toString().substring(0, 5);
            codelength = 6;
        }

        let selection = ICDs.map((icd) => {
            if (icd.code.toString().includes(term)
                && icd.code.toString().length === codelength) {
                return icd;
            } else {
                return 0;
            }
        });

        selection = selection.filter((value) => {
            return value !== 0;
        });

        this.setState({
            icdSelection: selection.sort(),
            filtered: filtered,
            icdCodelength: codelength,
            term: term
        });
    }

    /**
     * Sends selected ICD to parent MainUI
     * (which itself sends it to DetailsCard)
     * @param icd
     */
    sendIcdToMainUI(icd) {
        this.props.callbackFromMainUI(icd);
    }

    render() {
        const { icds } = this.state;

        const withBackButtonStyle = {
            height: '85vh',
            overflow: 'auto'
        }
        const withoutBackButtonStyle = {
            height: '90vh',
            overflow: 'auto'
        }

        const icdChapters = this.chapterICDs.map((icd, index) => {
            return <div className="list-group mr-1" key={index}>
                <div
                    className="list-group-item"
                    onClick={this.filterIcdsByChapter.bind(this, icd)}
                >
                    {icd.kapitel}
                </div>
            </div>
        });
        const icdSubGroup = icds.map((icd, index) => {
            if (icd.code.toString().includes(this.state.term)
                && icd.code.toString() !== this.state.term
                && icd.code.toString().length === this.state.icdCodelength) {
                return <div className="list-group mr-1" key={index}>
                    <div
                        className="list-group-item"
                        onClick={this.filterIcdsByIcdcode.bind(this, this.state, icd)}
                    >
                        {icd.code}
                    </div>
                </div>
            }
        });
        const loading = (
            <div className="text-uppercase">catalogue loading...</div>
        );
        const empty = (
            <></>
        );
        const backArrow = (
            <a type="button" className="btn btn-light" onClick={this.stepBackHierarchy.bind(this, this.state)}>
                <ArrowBackIcon/>
            </a>
        );

        return (
            <div>
                <div>
                    {icds.length > 0 && this.state.filtered === true ? backArrow : empty}
                </div>
                <div style={this.state.filtered ? withBackButtonStyle : withoutBackButtonStyle}>
                    {icds.length > 0 ? empty : loading}
                    {icds.length > 0 && this.state.filtered === false ? icdChapters : empty}
                    {icds.length > 0 && this.state.filtered === true ? icdSubGroup : empty}
                </div>
            </div>
        )
    }
}

export default Sidebar;
