import React from "react";
import ReactDOM from "react-dom";
import { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import jwt_decode from "jwt-decode";

function Beta() {
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState("");
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleUpdateList = (courses) => {
    setCourseList(
      courses.map((course) => (
        <li
          className="text-lg font-medium font-sans text-gray-700 hover:outline hover:outline-1 py-2 my-2 mx-2 rounded-lg"
          key={course.title}
        >
          <label
            className="form-check-label inline-block text-gray-800"
            for="delete"
          >
            <input
              className="form-check-input appearance-none mx-4 h-5 w-5 border rounded-md border-ubc-grey bg-white checked:bg-ubc-blue focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
              type="checkbox"
              value=""
              id={
                course.department +
                " " +
                course.number +
                " " +
                course.section +
                " " +
                course.session
              }
            />
            <span className="p-2">{course.department}</span>
            <span className="p-2">{course.number}</span>
            <span className="p-2">{course.section}</span>
            <span className="p-2">{course.session}</span>
            <span className="p-2">
              {course.restricted ? "Restricted + General" : "General Only"}
            </span>
            <span className="p-2">{course.description}</span>
          </label>
        </li>
      ))
    );
  };

  useEffect(() => {
    if (courses != []) {
      const courseDetail = fetch(
        `https://witmeewq6e.execute-api.us-west-2.amazonaws.com/v1/courses?courses=${courses}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: tokenLogin,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          trackedCourses = data;
          handleUpdateList(data);
        });
    } else {
      handleUpdateList([]);
    }
  }, [courses]);

  function login() {
    window.location.replace(
      "https://letmeinubc.auth.us-west-2.amazoncognito.com/login?client_id=2shgpu14nnj4ulipe5ui6ja6b7&response_type=token&scope=openid&redirect_uri=https://dxi81lck7ldij.cloudfront.net/"
    );
    return null;
  }

  async function getCourses(token) {
    const getCourse = fetch(
      `https://witmeewq6e.execute-api.us-west-2.amazonaws.com/v1/tracking?key=email&email=${
        jwt_decode(token).email
      }`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: token,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        trackedCourses = data;
        if (data == []) {
          setCourses([]);
        } else {
          setCourses(trackedCourses?.map((course) => course.name).join(","));
        }
      });
  }

  let trackedCourses;
  let tokenLogin;
  try {
    tokenLogin = window.location.href.split("=")[1].split("&"[0])[0];
    
    getCourses(tokenLogin);
  } catch (e) {
    return (
      <div>
        <button
          className="inline-flex justify-center py-2 px-4 mr-4 border border-transparent shadow-sm text-lg font-sans font-lg rounded-md text-white bg-ubc-blue hover:bg-ubc-grey focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indio-500"
          onClick={login}
        >
          Login
        </button>
      </div>
    );
  }

  const recordTracking = async (e, info) => {
    setLoading(true);
    e.preventDefault();
    // const token = window.location.href
    //   .slice(
    //     window.location.href.search("id_token="),
    //     window.location.href.search("&access_token")
    //   )
    //   .split("=")[1];

    console.log(tokenLogin);

    const restricted = info.restricted ? "true" : "false";
    const session = info.session === "Winter" ? "W" : "S";
    const email = jwt_decode(tokenLogin).email;

    const response = await fetch(
      "https://witmeewq6e.execute-api.us-west-2.amazonaws.com/v1/tracking",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: tokenLogin,
        },
        body: JSON.stringify({
          session: session,
          department: info.department,
          number: info.course_number,
          section: info.section,
          email: email,
          restricted: restricted,
        }),
      }
    ).then((response) => {
      if (response.status === 404) {
        alert("Invalid Course Specified");
      }
    });

    getCourses(tokenLogin);
    setLoading(false);
    setOpen(false);

    return 200;
  };

  async function deleteSelectedTracking() {
    setDeleteLoading(true);
    var items = document.querySelectorAll("input[type=checkbox]:checked");
    for (var i = 0; i < items.length; i++) {
      console.log(items[i].id.replace(/\s+/g, " ").trim().split(" "));
      let deleteArray = items[i].id.replace(/\s+/g, " ").trim().split(" ");
      const response = await fetch(
        "https://witmeewq6e.execute-api.us-west-2.amazonaws.com/v1/tracking",
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: tokenLogin,
          },
          body: JSON.stringify({
            session: deleteArray[3],
            department: deleteArray[0],
            number: deleteArray[1],
            section: deleteArray[2],
            email: jwt_decode(tokenLogin).email,
          }),
        }
      );
    }
    setDeleteLoading(false);
    getCourses(tokenLogin);
  }

  function trim(myString) {
    return myString.replace(/^\s+|\s+$/g, "");
  }

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
                  <div className="mt-5 md:mt-0 md:col-span-2">
                    <form>
                      <div className="shadow overflow-hidden sm:rounded-md">
                        <div className="px-4 py-5 bg-white sm:p-6">
                          <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-6 sm:col-span-3 py-2">
                              <label
                                htmlFor="department"
                                className="block text-lg font-medium font-sans text-gray-700"
                              >
                                Department
                              </label>
                              <input
                                type="text"
                                name="department"
                                id="department"
                                placeholder="CPSC"
                                className="uppercase mt-1 h-10 pl-1 focus:ring-indigo-500 focus:border-inido-500 block w-full shawdow-sm sm:text-base border-gray-300 rounded-md"
                              />
                            </div>

                            <div className="col-span-6 sm:col-span-3 py-2">
                              <label
                                htmlFor="course-number"
                                className="block text-lg font-medium font-sans text-gray-700"
                              >
                                Course Number
                              </label>
                              <input
                                type="text"
                                name="course-number"
                                id="course-number"
                                placeholder="340"
                                className="uppercase mt-1 h-10 pl-1 focus:ring-indigo-500 focus:border-inido-500 block w-full shawdow-sm sm:text-base border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                          <div className="col-span-6 sm:col-span-4 py-2">
                            <label
                              htmlFor="section"
                              className="block text-lg font-medium text-gray-700"
                            >
                              Section
                            </label>
                            <input
                              type="text"
                              name="section"
                              id="section"
                              placeholder="101"
                              className="uppercase mt-1 h-10 pl-1 font-sans focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-lg border-gray-300 rounded-md"
                            />
                          </div>
                          <div className="col-span-6 sm:col-span-3 py-2">
                            <label
                              htmlFor="session"
                              className="h-10 pl-1block text-lg font-medium text-gray-700"
                            >
                              Session
                            </label>
                            <select
                              name="session"
                              id="session"
                              className="h-10 pl-1 mt-1 block w-full py2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
                            >
                              <option>Winter</option>
                              <option>Summer</option>
                            </select>
                          </div>
                          <div className="col-span-6 sm:col-span-3 py-2">
                            <label
                              htmlFor="session"
                              className="h-10 pl-1block text-lg font-medium text-gray-700"
                            >
                              General Seats Only
                            </label>
                            <input
                              className="form-check-input appearance-none h-5 w-5 border rounded-md border-ubc-grey bg-white checked:bg-ubc-blue focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                              type="checkbox"
                              name="restricted"
                              id="restricted"
                            />
                          </div>
                          <div className="px-4 py-3 mt-4 bg-ubc-grey-50 text-right sm:px-6">
                            <button
                              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-lg font-sans font-lg rounded-md text-white bg-ubc-blue hover:bg-ubc-grey focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indio-500 disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={async (e) => {
                                let res = await recordTracking(e, {
                                  department: trim(
                                    document
                                      .getElementById("department")
                                      .value.toUpperCase()
                                  ),
                                  course_number: trim(
                                    document
                                      .getElementById("course-number")
                                      .value.toUpperCase()
                                  ),
                                  section: trim(
                                    document
                                      .getElementById("section")
                                      .value.toUpperCase()
                                  ),
                                  session:
                                    document.getElementById("session").value,
                                  restricted:
                                    document.getElementById("restricted")
                                      .checked,
                                });
                              }}
                              disabled={loading}
                            >
                              {loading && (
                                <span className="text-lg font-lg font-sans text-white">
                                  Submitting...
                                </span>
                              )}
                              {!loading && (
                                <span className="text-lg font-lg font-sans text-white">
                                  Submit
                                </span>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <div className="mt-10 my-20 sm:mt-10 sm:mx-40 bg-ubc-blue px-20 py-10 rounded-lg m-1">
        <div className="md:grid md:grid-cols-3 md:gap-6 ">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-3xl font-sans font-bold leading-6 text-white">
                LetMeInUBC
              </h3>
              <p className="mt-1 text-lg font-sans font-medium text-ubc-grey mt-3">
                Register Course: <br /> Add courses to your watch-list and when a spot is available, you will be notified by email.
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 bg-white sm:p-6 h-half-screen relative">
                <div className="">
                  <ul className="max-h-80 ml-4 mt-4 overflow-auto overflow-y-scroll border-red-800">
                    {courseList}
                  </ul>
                </div>

                <div className="px-4 py-4 m-4 text-right sm:px-6 absolute bottom-0 right-0">
                  <button
                    className="inline-flex justify-center py-2 px-4 mr-4 border border-transparent shadow-sm text-lg font-sans font-lg rounded-md text-white bg-ubc-blue hover:bg-ubc-grey focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indio-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={deleteSelectedTracking}
                    disabled={deleteLoading}
                  >
                    {deleteLoading && (
                      <span className="text-lg font-lg font-sans text-white">
                        Deleting...
                      </span>
                    )}
                    {!deleteLoading && (
                      <span className="text-lg font-lg font-sans text-white">
                        Delete
                      </span>
                    )}
                  </button>
                  <button
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-lg font-sans font-lg rounded-md text-white bg-ubc-blue hover:bg-ubc-grey focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indio-500"
                    onClick={() => setOpen(true)}
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

export default Beta;
