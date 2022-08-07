import React from "react";
import { HiCursorClick } from "react-icons/hi";
import { FaCheckSquare, FaBell } from "react-icons/fa";

import InfoWidget from "../InfoWidget";
import CoursesWidget from "../CoursesWidget";

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

          <div className="flex flex-col items-center justify-center mb-4">
            <h1 className="font-bold text-5xl mb-4 mt-8 sm:mt-0">
              Courses are full?
            </h1>
            <p className="text-xl">
              Track a UBC courses seating and get notified when there's a seat
              available for you. For <strong>free</strong>!
            </p>
          </div>

          <CoursesWidget />

          {/* how it works */}
          <div className="flex justify-center">
            <div className="pt-12 sm:pt-6 mb-6 flex-inline text-3xl font-semibold text-black">
              <p>How Does It Work?</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-y-8 sm:gap-y-0 sm:gap-x-8">
            <InfoWidget
              title="Register Now"
              icon={<HiCursorClick className="text-xl m-6 mt-0" />}
            />
            <InfoWidget
              title="Track a Course"
              icon={<FaCheckSquare className="text-xl m-6 mt-0" />}
            />
            <InfoWidget
              title="Get Notified"
              icon={<FaBell className="text-xl m-6 mt-0" />}
            />
          </div>

          <p className="flex justify-center">
            Built by UBC students, free for everyone.
          </p>
        </div>
      </div>
    </>
  );
}
