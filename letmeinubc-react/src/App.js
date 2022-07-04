import { React, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/pages/Landing";
import Dashboard from "./components/pages/Dashboard";
import Account from "./components/pages/Account";
import Beta from "./Beta";
import SideBar from "./components/SideBar";

function App() {
  // Redirect to login if token is not found
  function login() {
    window.location.replace(
      "https://letmeinubc.auth.us-west-2.amazoncognito.com/login?client_id=2shgpu14nnj4ulipe5ui6ja6b7&response_type=token&scope=openid&redirect_uri=https://dxi81lck7ldij.cloudfront.net/"
    );
    return null;
  }
  let tokenLogin;

  // Get token from URL, if token is not found, button to redirect to login

  try {
    tokenLogin = window.location.href.split("=")[1].split("&"[0])[0];

    console.log("loging");
  } catch (e) {
    return (
      <div>
        <button
          className="inline-flex justify-center py-2 px-4 mr-4 border border-transparent shadow-sm text-lg font-sans font-lg rounded-md text-white bg-ubc-blue hover:bg-ubc-grey focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indio-500"
          onClick={() => login}
        >
          Login
        </button>
      </div>
    );
  }

  console.log("this is");
  console.log(tokenLogin);
  return (
    <>
      <Router>
        <Routes>
          <Route path="/account" element={<Account />} />
          <Route path="/" element={<Dashboard loginToken={tokenLogin} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
