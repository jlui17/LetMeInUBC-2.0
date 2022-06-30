import React from "react";
import SideBar from "../SideBar";

export default function Dashboard() {
    return (
      <>
        <div className="flex my-10 mx-10 h-almost-screen">
          <div className="basis-f20 rounded-l-xl bg-cool-blue">
            <SideBar />
          </div>

          <div className="basis-5/6 md:grid md:grid-cols-5 bg-white rounded-r-xl">
            <div className="mt-5 md:mt-0 md:col-span-3 ml-20">
              <h1 className="text-5xl font-bold font-sans text-black my-16">
                {" "}
                UBC Course Tracker
              </h1>

              <div className="flex justify-between">
                <span className="text-2xl font-sans font-bold inline-flex">
                  My tracked courses
                </span>
                <button
                  className="inline-flex justify-center py-2 px-4 mr-4 border border-transparent shadow-sm text-lg font-sans font-lg rounded-md text-white bg-ubc-blue hover:bg-ubc-grey focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indio-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  // onClick={deleteSelectedTracking}
                  // disabled={deleteLoading}
                >
                  <span className="text-lg font-lg font-sans text-white">
                    Delete
                  </span>
                </button>
                <button
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-lg font-sans font-lg rounded-md text-white bg-ubc-blue hover:bg-ubc-grey focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indio-500"
                  // onClick={() => setOpen(true)}
                >
                  Add Course
                </button>
              </div>

              <div className="shadow overflow-hidden sm:rounded-md border-ubc-blue border-solid border-2">
                <div className="px-4 py-5 bg-white sm:p-6">
                  <div className="">
                    <ul className="max-h-80 ml-4 mt-4 overflow-auto overflow-y-scroll border-red-800">
                      {/* {courseList} */}
                    </ul>
                  </div>

                  <div className="px-4 py-3 mt-4 bg-ubc-grey-50 text-right sm:px-6">
                    <button
                      className="inline-flex justify-center py-2 px-4 mr-4 border border-transparent shadow-sm text-lg font-sans font-lg rounded-md text-white bg-ubc-blue hover:bg-ubc-grey focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indio-500"
                      // onClick={deleteSelectedTracking}
                    >
                      Delete
                    </button>
                    <button
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-lg font-sans font-lg rounded-md text-white bg-ubc-blue hover:bg-ubc-grey focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indio-500"
                      // onClick={() => setOpen(true)}
                    >
                      Add Course
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
}