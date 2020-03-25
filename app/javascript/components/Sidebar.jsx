import React from 'react';
import {Drawer} from "@material-ui/core";
import {IconButton, List, ListItem, ListItemText} from '@material-ui/core';
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import $ from "jquery";

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
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
            .then(response => this.setState({ icds: response }))
            .catch(() => this.props.history.push("/"));
    }

    /**
     * Gets ICD's from next superior level in hierarchy via shortening
     * the search term and searching the ICD's array
     */
    stepBackHierarchy() {
        const state = this.state;
        const ICDs = state.icds;

        let term = state.term;
        let filtered = true;
        let codelength;

        if (term.toString().length === 3) {
            term = term.toString().substring(0, 1);
            filtered = false;
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

        this.setState({
            icdSelection: selection.sort(),
            filtered: filtered,
            icdCodelength: codelength,
            term: term
        });
    }

    /**
     * Filters ICD's according to the code of a given ICD
     * and stores the filtered and sorted array in the state
     * @param icds
     * @param icd
     */
    filter(state, icd) {
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
        };

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

        this.selectIcd(icd);
    }

    /**
     * Sends selected ICD to parent MainUI
     * (which itself sends it to DetailsCard)
     * @param icd
     */
    selectIcd(icd) {
        this.props.callbackFromMainUI(icd);
    }

    render() {
        const { icds } = this.state;

        const allIcds = icds.map((icd, index) => {
            if (icd !== null
                && icd.code.toString().length === this.state.icdCodelength) {
                return <div className="list-group" key={index}>
                    <div
                        className="list-group-item"
                        onClick={this.filter.bind(this, this.state, icd)}
                    >
                        {icd.code}
                    </div>
                </div>
            }
        });
        const icdSubGroup = icds.map((icd, index) => {
            if (icd.code.toString().includes(this.state.term)
                && icd.code.toString() !== this.state.term
                && icd.code.toString().length === this.state.icdCodelength) {
                return <div className="list-group" key={index}>
                    <div
                        className="list-group-item"
                        onClick={this.filter.bind(this, this.state, icd)}
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
            <IconButton onClick={this.stepBackHierarchy.bind(this, this.state)}>
                <ArrowBackIcon/>
            </IconButton>
        );

        return (
            <div>
                {icds.length > 0 ? empty : loading}
                {icds.length > 0 && this.state.filtered === false ? allIcds : backArrow}
                {icds.length > 0 && this.state.filtered === true ? icdSubGroup : empty}
            </div>
        )
    }
}

export default Sidebar;
