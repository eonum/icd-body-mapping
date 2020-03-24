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
            icdCodeLength: 3,
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
     * the search term and calling backend
     */
    stepBackHierarchy() {
        let term = this.state.term;
        let filtered = true;
        if (term.toString().length === 3) {
            term = term.toString().substring(0, 1);
            filtered = false;
        } else if (term.toString().length === 5) {
            term = term.toString().substring(0, 3);
        } else if (term.toString().length === 6) {
            term = term.toString().substring(0, 5);
        }
        this.setState({
            filtered: filtered,
            term: term
        }, () => {
            $.getJSON('/search?q=' + this.state.term)
                .then(async response =>
                    this.setGroup(await response)
                )
        });
    }

    /**
     * Sends selected ICD to parent MainUI
     * (which itself sends it to DetailsCard)
     * @param icd
     */
    selectIcd(icd) {
        this.props.callbackFromMainUI(icd);
    }

    getAutoCompleteResults(e){
        this.setState({
            term: e.code
        }, () => {
            $.getJSON('/search?q=' + this.state.term)
                .then(async response =>
                    this.setGroup(await response)
                )
        });

        this.selectIcd(e);
    }

    filter(icds, icd) {
        const ICDs = icds.icds;
        const icdCode = icd.code.toString();
        let codeLength;

        switch (icdCode.length) {
            case 1:
                codeLength = 3;
                break;
            case 3:
                codeLength = 5;
                break;
            case 5:
                codeLength = 6;
                break;
        };

        this.setState({
            icdCodeLength: codeLength
        });

        let selection = ICDs.map((icd) => {
            if (icd.code.toString().includes(icdCode)
                && icd.code.toString().length === codeLength) {
                return icd;
            } else {
                return 0;
            }
        });

        selection = selection.filter((value) => {
            return value !== 0;
        });
        selection = selection.sort();

        this.setState({
            icdSelection: selection,
            filtered: true,
            term: icdCode
        });
        console.log(this.state.icdSelection);

        this.selectIcd(icd);
    }

    /**
     * Sets up current selection of ICD's
     * @param response
     */
    setGroup(response) {
        response.sort();
        this.setState({
            icds: response,
            icdSelection: response
        })
    }

    render() {
        const { icds } = this.state;
        console.log(icds);
        const allIcds = icds.map((icd, index) => {
            if (icd !== null && icd.code.toString().length === this.state.icdCodeLength) {
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
                && icd.code.toString() !== this.state.term) {
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
