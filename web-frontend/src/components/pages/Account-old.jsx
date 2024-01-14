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
      <div className="h-almost-screen mx-2 my-5 flex sm:mx-10 sm:my-10">
        <div className="basis-f20 w-10 rounded-l-xl bg-cool-blue sm:w-full">
          <SideBar />
        </div>

        <div className="basis-5/6 rounded-r-xl bg-white shadow-2xl md:grid md:grid-cols-5">
          <div className="ml-5 mr-5 mt-5 sm:ml-20 md:col-span-4 md:mt-0">
            <h1 className="my-16 font-sans text-3xl font-bold text-black sm:text-5xl">
              {" "}
              Account
            </h1>

            <div className="flex justify-between">
              <span className="inline-block font-sans text-xl font-bold sm:text-2xl">
                Reset Password
              </span>

              <button className="font-lg focus:ring-indio-500 inline-flex justify-center rounded-md border border-transparent bg-ubc-blue px-4 py-2 font-sans text-lg text-white shadow-sm hover:bg-ubc-grey focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <a href={LOGIN_URL}>Reset</a>
              </button>
            </div>
            <div className="mt-5 flex justify-between">
              <span className="inline-block font-sans text-xl font-bold sm:text-2xl">
                Logout
              </span>
              <button className="font-lg focus:ring-indio-500 inline-flex justify-center rounded-md border border-transparent bg-ubc-blue px-4 py-2 font-sans text-lg text-white shadow-sm hover:bg-ubc-grey focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <a href={LOGIN_URL}>Logout</a>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
