import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/pages/Landing";
import Dashboard from "./components/pages/Dashboard";
import Account from "./components/pages/Account";
import Beta from "./Beta";
import SideBar from "./components/SideBar";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/landing" element={<Landing />} /> 
          <Route path="/" element={<Account />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
