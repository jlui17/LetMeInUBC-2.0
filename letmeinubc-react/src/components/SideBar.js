import { React, useState } from "react";
import { NavLink } from "react-router-dom";

function SideBar() {
    const [dashboard, setDashboard] = useState(false);
    const [about, setAbout] = useState(false);
  return (
    <>
      <nav className="my-5 mx-6 flex-row">
        <h1 className="my-10 mb-10 text-4xl font-medium font-sans text-white mb-5">
          {" "}
          LetMeInUBC
        </h1>
        <div>
          <ul>
            <li>
              <div
                className={
                  dashboard
                    ? "bg-highlight-blue w-full rounded-md py-3 px-2"
                    : "w-full rounded-md py-3 px-2"
                }
              >
                <NavLink
                  className={({ isActive }) =>
                    isActive ? setDashboard(true) : setDashboard(false)
                  }
                  to="/dashboard"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 inline-block mr-2"
                    viewBox="0 0 20 20"
                    fill="white"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-white">Dashboard</span>
                </NavLink>
              </div>
            </li>
            <li>
              <div
                className={
                  about
                    ? "bg-highlight-blue w-full rounded-md py-3 px-2"
                    : "w-full rounded-md py-3 px-2"
                }
              >
                <NavLink
                  className={({ isActive }) =>
                    isActive ? setAbout(true) : setAbout(false)
                  }
                  to="/"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 inline-block mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span
                    className="text-white"
                  >
                    About
                  </span>
                </NavLink>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default SideBar;
