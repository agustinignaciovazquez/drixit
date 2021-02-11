import React from "react";
import { HashRouter as Router, Route, Redirect } from "react-router-dom";
import './App.css';
import Login from "./Login";
import UserDetails from "./UserDetails";
import {Switch} from "@material-ui/core";
function App() {
    return (
        <Router>
            <Route path="/login" component={Login}/>
            <Route path="/me" component={UserDetails}/>
            <Route exact path="/">
                <Redirect to="/login" />
            </Route>
        </Router>
    );
}

export default App;
