import React from 'react';
import {Drawer} from "@material-ui/core";
import {List, ListItem, ListItemText} from '@material-ui/core';
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            icds: []
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

    selectIcd(icd) {
        this.props.callbackFromMainUI(icd);
    }

    render() {
        const { icds } = this.state;
        const allIcds = icds.map((icd, index) => (
            <div className="list-group" key={index}>
                <div className="list-group-item" onClick={this.selectIcd.bind(this, icd)}>
                    {icd.code}
                </div>
            </div>
        ));
        const noIcd = (
            <div className="text-uppercase">catalogue loading...</div>
        );

        return (
            <div>
                {icds.length > 0 ? allIcds : noIcd}
            </div>
        )
    }
}

export default Sidebar;
