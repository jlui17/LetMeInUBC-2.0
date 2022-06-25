import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/pages/Landing"
import Dashboard from "./components/pages/Dashboard";


function App() {
  return (

    <>
      <Router>
        <Routes>
          <Route path="/" exact component={Landing} />
          <Route path="/dashboard" component={Dashboard} /> 
        </Routes>
      </Router>
    </>

  )
}
