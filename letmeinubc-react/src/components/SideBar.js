import { React, useState } from "react";
import { NavLink } from "react-router-dom";

function SideBar() {
  const [dashboard, setDashboard] = useState(false);
  const [about, setAbout] = useState(false);
  return (
    <>
      <nav className="my-5 mx-6 sm:flex-col sm:flex sm:items-center sm:mr-3">
        <h1 className="my-10 mb-10 text-4xl font-medium font-sans text-white sm:mt-24 sm:mb-28 sm:rotate-90 sm:text-2xl">
          {" "}
          LetMeInUBC
        </h1>
        <div className="sm:flex-col sm:flex sm:items-center">
          <div
            className={
              dashboard
                ? "bg-highlight-blue w-full rounded-md py-3 px-2 sm:w-12"
                : " w-full rounded-md py-3 px-2 sm:w-12"
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
                className="h-6 w-6 inline-block mr-2 sm:mx-1"
                viewBox="0 0 20 20"
                fill="white"
              >
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span className="text-white sm:hidden sm:mx-0">Dashboard</span>
            </NavLink>
          </div>
          <div
            className={
              about
                ? "bg-highlight-blue w-full rounded-md py-3 px-2 sm:w-12"
                : " w-full rounded-md py-3 px-2 sm:w-12"
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
                className="h-6 w-6 inline-block mr-2 sm:mx-1"
                viewBox="0 0 20 20"
                fill="white"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-white sm:hidden sm:mx-0">Account</span>
            </NavLink>
          </div>
        </div>
      </nav>
    </>
  );
}

export default SideBar;
