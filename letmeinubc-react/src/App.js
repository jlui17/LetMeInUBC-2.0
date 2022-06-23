import React from "react";
import { Browser as Router, Switch, Route } from "react-router-dom";
import Landing from "./components/pages/Landing"
import Dashboard from "./components/pages/Dashboard";


function App() {
  return (

    <>
      <Router>
        <Switch>
          <Route path="/" exact component={Landing} />
          <Route path="/dashboard" component={Dashboard} /> 
        </Switch>
      </Router>
    </>

  )
}
