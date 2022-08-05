import React from "react";
import SideBar from "../SideBar";

export default function Account() {
  function login() {
    window.location.replace(
      "https://letmeinubc.auth.us-west-2.amazoncognito.com/login?client_id=2shgpu14nnj4ulipe5ui6ja6b7&response_type=token&scope=openid&redirect_uri=https://dxi81lck7ldij.cloudfront.net/"
    );
    return null;
  }
  return (
    <>
      <div className="flex my-10 mx-10 h-almost-screen">
        <div className="basis-f20 rounded-l-xl bg-cool-blue">
          <SideBar />
        </div>

        <div className="basis-5/6 md:grid md:grid-cols-5 bg-white rounded-r-xl shadow-2xl">
          <div className="mt-5 md:mt-0 md:col-span-4 ml-20">
            <h1 className="text-5xl font-bold font-sans text-black my-16">
              {" "}
              Account
            </h1>

            <div className="flex justify-between">
              <span className="text-2xl font-sans font-bold inline-block">
                Reset Password
              </span>

              <button className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-lg font-sans font-lg rounded-md text-white bg-ubc-blue hover:bg-ubc-grey focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indio-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <a href="https://letmeinubc.auth.us-west-2.amazoncognito.com/forgotPassword?client_id=2shgpu14nnj4ulipe5ui6ja6b7&response_type=token&scope=openid&redirect_uri=https://dxi81lck7ldij.cloudfront.net/">
                  Reset
                </a>
              </button>
            </div>
            <div className="flex justify-between mt-5">
              <span className="text-2xl font-sans font-bold inline-block">
                Logout
              </span>
              <button className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-lg font-sans font-lg rounded-md text-white bg-ubc-blue hover:bg-ubc-grey focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indio-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <a href="https://letmeinubc.auth.us-west-2.amazoncognito.com/login?client_id=2shgpu14nnj4ulipe5ui6ja6b7&response_type=token&scope=openid&redirect_uri=https://dxi81lck7ldij.cloudfront.net/">
                  Logout
                </a>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
