import React from 'react';
import {Drawer} from "@material-ui/core";
import {List, ListItem, ListItemText} from '@material-ui/core';
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";

class Sidebar extends React.Component {
    selectedIcdID;

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
        const allIcds = icds.map((icd, index) => (
                <ListItem key={index}>
                    <Button onClick={this.selectIcd(icd.id)}>
                        {icd.code}
                    </Button>
                </ListItem>
        ));
        const noIcd = (
            <ListItem>
                Icd catalogue loading...
            </ListItem>
        );

        return (
            <Drawer variant="permanent">
                <List disablePadding>
                    {icds.length > 0 ? allIcds : noIcd}
                </List>
            </Drawer>
        )
    }

    selectIcd(id) {
        this.selectedIcdID = id;
        console.log(id);
    }
}

export default Sidebar;
