import React from "react";

export default function Account() {
      function login() {
        window.location.replace(
          "https://letmeinubc.auth.us-west-2.amazoncognito.com/login?client_id=2shgpu14nnj4ulipe5ui6ja6b7&response_type=token&scope=openid&redirect_uri=https://dxi81lck7ldij.cloudfront.net/"
        );
        return null;
      }

      function register() {
        window.location.replace(
            // registration link 
        );
        return null; 
      }
  return (
    <>
    <div className="flex w-full h-full bg-white">
      <div className="flex-col w-full h-full items-center my-10 mx-10 justify-center h-almost-screen">
        
        {/* header  */}
        <div className="flex w-full justify-between">
            {/* letmein  */}
            <div className="space-y-6 py-12 pl-12 pr-6 text-3xl font-bold leading-7 text-cool-blue">
                <p>LetMeInUBC</p>
            </div>

            {/* two buttons  */}
            <div className="flex py-12 pl-6 pr-12"> 
                <button className="mr-1 h-8 w-28 inline-flex justify-center align-text-middle border-4 border-transparent shadow-sm text-md font-sans font-lg rounded-xl text-white bg-ubc-blue hover:bg-ubc-grey focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indio-500"
                    onClick={login}
                >
                    Log in
                </button>

                <button className="ml-1 h-8 w-28 inline-flex justify-center align-text-middle border-4 border-transparent shadow-sm text-md font-sans font-lg rounded-xl text-white bg-ubc-blue hover:bg-ubc-grey focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indio-500"
                    onClick={register}
                >
                    Register
                </button>
            </div>
        </div> 



        {/* how it works */}
        <div className="flex justify-center">
            <div className="flex-inline space-y-6 py-12 text-3xl font-bold leading-7 text-black">
                    <p>How it works</p>
                </div>

            {/* instructions dialog  */}
        </div>


        {/* team  */}
        <div className="flex justify-center">
            <div className="flex-inline space-y-6 py-12 text-3xl font-bold leading-7 text-black">
                    <p>Meet the team</p>
                </div>
            
            {/* headshots  */}
        </div>


        </div>
      </div>
    </>
  );
}
