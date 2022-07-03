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
        <div className="basis-5/6 md:grid md:grid-cols-5 bg-white rounded-r-xl">
          <button
            className="inline-flex h-40 justify-center py-2 px-4 mr-4 border border-transparent shadow-sm text-lg font-sans font-lg rounded-md text-white bg-ubc-blue hover:bg-ubc-grey focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indio-500"
            onClick={login}
          >
            Login
          </button>
        </div>
      </div>
    </>
  );
}
