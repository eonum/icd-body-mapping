import React from 'react';
import {Drawer} from "@material-ui/core";
import {List, ListItem, ListItemText} from '@material-ui/core';
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";

class Sidebar extends React.Component {
    selectedIcd;

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

    render() {
        const { icds } = this.state;
        /*
        const allIcds = icds.map((icd, index) => (
                <ListItem key={index}>
                    <Button onClick={this.selectIcd(icd)}>
                        {icd.code}
                    </Button>
                </ListItem>
        ));
        const noIcd = (
            <ListItem>
                Icd catalogue loading...
            </ListItem>
        );*/

        const allIcds = icds.map((icd, index) => (
            <div className="list-group" key={index}>
                <a className="list-group-item" href={`#`} onClick={this.selectIcd(icd)}>
                    {icd.code}
                </a>
            </div>
        ));
        const noIcd = (
            <div className="text-uppercase">catalogue loading...</div>
        );
/*
        return (
            <div>
                <Drawer variant="permanent">
                    <List disablePadding>
                        {icds.length > 0 ? allIcds : noIcd}
                    </List>
                </Drawer>
            </div>
        )*/

        return (
            <div>
                {icds.length > 0 ? allIcds : noIcd}
            </div>
        )
    }

    selectIcd(icd) {
        this.selectedIcd = icd;
    }
}

export default Sidebar;
