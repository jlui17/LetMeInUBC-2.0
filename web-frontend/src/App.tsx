import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
// import Account from "./components/pages/Account";
import { jwtDecode } from "jwt-decode";
import Dashboard from "./components/pages/Dashboard";
import Landing from "./components/pages/Landing";
import { Token } from "./types/cognito";
import Account from "./components/pages/Account";
function App() {
  const [token, setToken] = useState<Token | null>(null);
  const [rawToken, setRawToken] = useState<string | null>(null);
  const nav = useNavigate();

  useEffect(() => {
    try {
      const rawToken = window.location.href.split("=")[1].split("&")[0];

      const token = jwtDecode(rawToken) as Token;
      setToken(token);
      setRawToken(rawToken);
    } catch (e) {
      nav("/");
      setToken(null);
      setRawToken(null);
      console.log("not Logged in");
    }
  }, [nav]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/account" element={<Account {...{ token, rawToken }} />} />
      <Route
        path="/dashboard"
        element={<Dashboard {...{ token, rawToken }} />}
      />
    </Routes>
  );
}

export default App;
