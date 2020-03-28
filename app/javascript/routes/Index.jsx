import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../components/Home";
import Icds from "../components/Icds";
import Icd from "../components/Icd";
import MainUI from "../components/MainUi";

export default (
    <Router>
        <Switch>
            <Route path="/" exact component={MainUI} />
        </Switch>
    </Router>
);
