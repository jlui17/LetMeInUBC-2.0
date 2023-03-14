import { React, useState } from "react";
import { NavLink } from "react-router-dom";

function SideBar() {
  const [dashboard, setDashboard] = useState(false);
  const [about, setAbout] = useState(false);
  return (
    <>
      <nav className="sm:mx-6 flex-col flex items-center sm:items-start my-16 ">
        <h1 className="sm:my-10 sm:mb-10 sm:text-4xl sm:rotate-0 hidden sm:inline-block font-medium font-sans text-white mt-24 mb-28 rotate-90 text-2xl">
          {" "}
          LetMeInUBC
        </h1>
        <div className="flex-col flex items-center w-full">
          <div
            className={
              dashboard
                ? "bg-highlight-blue sm:w-full rounded-md py-3 px-2 w-12"
                : " sm:w-full rounded-md py-3 px-2 w-12"
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
                className="h-6 w-6 inline-block sm:mr-2 mx-1"
                viewBox="0 0 20 20"
                fill="white"
              >
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span className="text-white hidden mx-0 sm:inline-block">
                Dashboard
              </span>
            </NavLink>
          </div>
          <div
            className={
              about
                ? "bg-highlight-blue sm:w-full rounded-md py-3 px-2 w-12"
                : " sm:w-full rounded-md py-3 px-2 w-12"
            }
          >
            <NavLink
              className={({ isActive }) =>
                isActive ? setAbout(true) : setAbout(false)
              }
              to="/account"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 inline-block sm:mr-2 mx-1"
                viewBox="0 0 20 20"
                fill="white"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-white hidden mx-0 sm:inline-block">
                Account
              </span>
            </NavLink>
          </div>
        </div>
      </nav>
    </>
  );
}

export default SideBar;
