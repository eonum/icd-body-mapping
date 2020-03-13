import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../components/Home";
import Icds from "../components/Icds";
import Icd from "../components/Icd";
import MainUI from "../components/MainUi";

export default (
    <Router>
        <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/icdCatalogue" exact component={Icds} />
            <Route path="/icdDetail/:id" exact component={Icd} />
            <Route path="/mainUI" exact component={MainUI} />
        </Switch>
    </Router>
);
