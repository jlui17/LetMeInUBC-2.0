import React from "react";
import { NavLink } from "react-router-dom";

export default function Account() {
  function login() {
    window.location.replace(
      "https://letmeinubc.auth.us-west-2.amazoncognito.com/login?client_id=2shgpu14nnj4ulipe5ui6ja6b7&response_type=token&scope=openid&redirect_uri=https://dxi81lck7ldij.cloudfront.net/dashboard/"
    );
    return null;
  }

  function register() {
    window.location.replace(
      "https://letmeinubc.auth.us-west-2.amazoncognito.com/signup?client_id=2shgpu14nnj4ulipe5ui6ja6b7&response_type=token&scope=openid&redirect_uri=https://dxi81lck7ldij.cloudfront.net/dashboard/"
    );
    return null;
  }
  return (
    <>
      <div className="flex w-full h-full bg-white">
        <div className="flex-col w-full h-full items-center my-10 mx-10 justify-center h-almost-screen space-y-4">
          {/* header  */}
          <div className="flex w-full justify-between">
            {/* letmein  */}
            <div className="space-y-6 py-8 pl-12 pr-6 text-4xl font-bold leading-7 text-cool-blue">
              <p>LetMeInUBC</p>
            </div>

            {/* two buttons  */}
            <div className="flex pt-8 py-10 pl-6 pr-12">
              <button
                className="mr-1 h-8 w-28 inline-flex justify-center align-text-middle border-4 border-transparent shadow-sm text-md font-sans font-lg rounded-xl text-white bg-ubc-blue hover:bg-ubc-grey focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indio-500"
              onClick={login}
              >
               
                 
                  Log in
                
              </button>

              <button
                className="ml-1 h-8 w-28 inline-flex justify-center align-text-middle border-4 border-transparent shadow-sm text-md font-sans font-lg rounded-xl text-white bg-ubc-blue hover:bg-ubc-grey focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indio-500"
                onClick={register}
              >
                Register
              </button>
            </div>
          </div>

          {/* how it works */}
          <div className="flex justify-center">
            <div className="pt-8 flex-inline text-3xl font-semibold text-black">
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

          {/* team  */}
          <div className="flex justify-center">
            <p className="flex-inline pt-20 text-3xl font-semibold text-black">
              Meet the team
            </p>
          </div>

          <div className="grid grid-cols-5 gap-6 px-10 justify-center">
            <img
              src="./logo512.png"
              className="flex flex-col rounded-lg basis-32"
              alt="headshot"
            ></img>

            <img
              src="./logo512.png"
              className="flex flex-col rounded-lg basis-32"
              alt="headshot"
            ></img>

            <img
              src="./logo512.png"
              className="flex flex-col rounded-lg basis-32"
              alt="headshot"
            ></img>

            <img
              src="./logo512.png"
              className="flex flex-col rounded-lg basis-32"
              alt="headshot"
            ></img>

            <img
              src="./logo512.png"
              className="flex flex-col rounded-lg basis-32"
              alt="headshot"
            ></img>
          </div>

          <div className="flex flex-col grid grid-cols-5 gap-6 px-10 justify-center text-center font-semibold text-md md:text-lg pb-24">
            <p> Justin Lui</p>
            <p> Lawrence Tang</p>
            <p> Kelvin Zhao</p>
            <p> William Chun</p>
            <p> Shannon Kao</p>
          </div>
        </div>
      </div>
    </>
  );
}
