import React from 'react';
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import DetailsCard from "./DetailsCard";
import SearchCard from "./SearchCard";
import Mapping from "./Mapping";
import './MainUI.css'
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import {Hidden, ListItem} from "@material-ui/core";
import {Link} from "react-router-dom";

class MainUI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchedIcds: ''
        };
    }

    componentDidMount() {

    }

    /**
     * Gets icds from search in Topbar
     * @param dataFromTopbar
     */
    callbackTopbarSearch = (dataFromTopbar) => {
        this.setState({ searchedIcds: dataFromTopbar });
        console.log(this.state.searchedIcds);
    };

    render() {
        const searchActive = (
            <SearchCard searchedIcds={this.state.searchedIcds} />
        );

        const searchInactive = (
            <DetailsCard />
        );

        return (
            <div>
                <link rel="shortcut icon" href="./images/favicon.ico"/>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <Topbar callbackFromMainUI={this.callbackTopbarSearch}/>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <Sidebar />
                        </div>
                        <div className="col-4">
                            {this.state.searchedIcds === '' ? searchInactive : searchActive}
                        </div>
                        <div className="col-6">
                            <Mapping />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MainUI;
