import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Account() {
  function login() {
    window.location.replace(
      "https://letmeinubc.auth.us-west-2.amazoncognito.com/login?client_id=3e2v22r2pfjoc3sokp8lj05la1&response_type=token&scope=openid&redirect_uri=https://letmeinubc.com/dashboard"
    );
    return null;
  }

  function register() {
    window.location.replace(
      "https://letmeinubc.auth.us-west-2.amazoncognito.com/signup?client_id=3e2v22r2pfjoc3sokp8lj05la1&response_type=token&scope=openid&redirect_uri=https://letmeinubc.com/dashboard"
    );
    return null;
  }
  return (
    <>
      <div className="flex w-full h-full bg-white">
        <div className="flex-col w-full h-full items-center my-10 mx-10 justify-center h-almost-screen space-y-4">
          {/* header  */}
          <div className="flex w-full justify-center grid grid-rows-2 grid-cols-1 sm:grid sm:grid-cols-2 sm:grid-rows-1">
            {/* letmein  */}
            <div className="flex w-full justify-center sm:justify-start space-y-6 py-8 text-4xl font-bold leading-7 text-cool-blue">
              <p>LetMeInUBC</p>
            </div>

            {/* two buttons  */}
            <div className="flex w-full justify-center sm:justify-end gap-4">
              <div className="w-2/3 grid grid-rows-2 grid-cols-1 gap-2 sm:w-80 sm:pt-8 sm:grid-cols-2 sm:gap-4">
                <button
                  className="h-8 inline-flex justify-center align-text-middle border-4 border-transparent shadow-sm text-md font-sans font-lg rounded-xl text-white bg-ubc-blue hover:bg-ubc-grey focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indio-500"
                  onClick={login}
                >
                  Log in
                </button>
                <button
                  className="h-8 inline-flex justify-center align-text-middle border-4 border-transparent shadow-sm text-md font-sans font-lg rounded-xl text-white bg-ubc-blue hover:bg-ubc-grey focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indio-500"
                  onClick={register}
                >
                  Register
                </button>
              </div>
            </div>
          </div>

          {/* how it works */}
          <div className="flex justify-center">
            <div className="pt-12 sm:pt-6 flex-inline text-3xl font-semibold text-black">
              <p>How it works</p>
            </div>
          </div>

          {/* instructions dialog  */}
          <div class="flex justify-center bg-white rounded-xl ring-1 ring-cool-blue mx-auto rounded-lg px-10 max-w-sm">
            <div class="py-8 space-y-3 text-lg leading-5 text-black-600">
              <p> 1. Sign up </p>
              <p> 2. Track a course </p>
              <p> 3. Get notified 📥 </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
