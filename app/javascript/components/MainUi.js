import React from 'react';
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import DetailsCard from "./DetailsCard";
import Mapping from "./Mapping";
import './MainUI.css'
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import {Hidden, ListItem} from "@material-ui/core";
import {Link} from "react-router-dom";

class MainUI extends React.Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {

    }

    render() {
        let icd = Sidebar.icd;
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <Topbar />
                    </div>
                </div>

                <div className="row">
                    <div className="col-2">
                        <Sidebar />
                    </div>
                    <div className="col-4">
                        <DetailsCard />
                    </div>
                    <div className="col-6">
                        <Mapping />
                    </div>
                </div>
            </div>

            /*
            <Grid
                container
                justify="space-around"
            >
                <Grid item><Topbar /></Grid>
                <Grid item><Sidebar /></Grid>
                <Grid item><DetailsCard /></Grid>
                <Grid item><Mapping /></Grid>
            </Grid>
            */
        )
    }
}

export default MainUI;
