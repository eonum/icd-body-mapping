import React from 'react';
import {Drawer} from "@material-ui/core";
import {List, ListItem, ListItemText} from '@material-ui/core';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    // ToDo: retrieve data to be displayed from backend
  }

  render() {
    return (
        <Drawer variant="permanent">
          <List disablePadding>
            <ListItem>1. Bla</ListItem>
            <ListItem>2. Bla</ListItem>
            <ListItem>3. Bla</ListItem>
          </List>
        </Drawer>
    )
  }
}

export default Sidebar;
