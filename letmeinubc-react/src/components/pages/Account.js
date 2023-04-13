import React from "react";
import SideBar from "../SideBar";
import { LOGIN_URL } from "../../common/config";

export default function Account() {
  function login() {
    window.location.replace(LOGIN_URL);
    return null;
  }
  return (
    <>
      <div className="flex sm:my-10 sm:mx-10 h-almost-screen my-5 mx-2">
        <div className="basis-f20 rounded-l-xl bg-cool-blue w-10 sm:w-full">
          <SideBar />
        </div>

        <div className="basis-5/6 md:grid md:grid-cols-5 bg-white rounded-r-xl shadow-2xl">
          <div className="mt-5 md:mt-0 md:col-span-4 sm:ml-20 mr-5 ml-5">
            <h1 className="sm:text-5xl font-bold font-sans text-black my-16 text-3xl">
              {" "}
              Account
            </h1>

            <div className="flex justify-between">
              <span className="sm:text-2xl font-sans font-bold inline-block text-xl">
                Reset Password
              </span>

              <button className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-lg font-sans font-lg rounded-md text-white bg-ubc-blue hover:bg-ubc-grey focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indio-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <a href={LOGIN_URL}>Reset</a>
              </button>
            </div>
            <div className="flex justify-between mt-5">
              <span className="sm:text-2xl font-sans font-bold inline-block text-xl">
                Logout
              </span>
              <button className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-lg font-sans font-lg rounded-md text-white bg-ubc-blue hover:bg-ubc-grey focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indio-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <a href={LOGIN_URL}>Logout</a>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
