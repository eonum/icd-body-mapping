import React from 'react';
import {Drawer} from "@material-ui/core";
import {List, ListItem, ListItemText} from '@material-ui/core';

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

    render() {
        const { icds } = this.state;
        const allIcds = icds.map((icd) => {
            <ListItem>{icd.code}</ListItem>
        });
        const noIcd = (
            <ListItem>
                Icd's haven't loaded yet
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
}

export default Sidebar;
