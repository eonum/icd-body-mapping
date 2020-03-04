import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../components/Home";
import Icds from "../components/Icds";
import Icd from "../components/Icd";

export default (
    <Router>
        <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/icds" exact component={Icds} />
            <Route path="/icds/:id" exact component={Icd} />
        </Switch>
    </Router>
);