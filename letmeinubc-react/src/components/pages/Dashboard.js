import { Dialog, Transition } from "@headlessui/react";
import jwt_decode from "jwt-decode";
import { Fragment, useEffect, useState } from "react";
import SideBar from "../SideBar";

export default function Dashboard(loginToken) {
  /* open state to show/hide modal*/
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [courseLoading, setCourseLoading] = useState(false);
  /*Auth token scraped from URL*/
  const [token, setToken] = useState("");

  const api_gateway_id = "q9nw3i29w0";

  /*ensures that auth token is present when on dashboard page*/
  if (!loginToken.loginToken) {
    window.location.replace("https://letmeinubc.com/");
  }

  useEffect(() => {
    setToken(loginToken.loginToken);
  }, []);

  useEffect(() => {
    getCourses();
  }, [token]);

  useEffect(() => {
    console.log("change");
    handleUpdateList(courses);
  }, [courses]);

  // Updates Dashboard courses list
  const handleUpdateList = (courses) => {
    console.log("updating:" + JSON.stringify(courses));
    if (courses) {
      setCourseList(
        courses.map((course) => (
          <li
            className="text-lg font-medium font-sans text-gray-700 hover:outline hover:outline-1 py-2 my-2 mx-2 rounded-lg"
            key={course.name.S + " " + course.restricted.S}
          >
            <label
              className="form-check-label text-gray-800 flex justify-between"
              for="delete"
            >
              <input
                className=" ml-4 form-check-input appearance-none sm:ml-2 h-5 w-5 border rounded-md border-ubc-grey bg-white checked:bg-ubc-blue focus:outline-none transition duration-200 mt-1 align-baseline bg-no-repeat bg-center bg-contain float-left cursor-pointer"
                type="checkbox"
                value=""
                id={course.name.S + " " + course.restricted.S}
              />
              <span>{course.department.S}</span>
              <span>{course.number.S}</span>
              <span>{course.section.S}</span>
              <span>{course.session.S}</span>
              <span className="lg:inline-block hidden">
                {course.restricted.S === "true"
                  ? "Restricted & General"
                  : "General Only"}
              </span>
              <span className="hidden lg:inline-block">
                {course.description.S}
              </span>
            </label>
          </li>
        ))
      );
    }
    setCourseLoading(false);
  };

  // API call to get user's courses from dynamodb based on email. Updates [courses] with returned data - this will trigger handleUpdateList.
  async function getCourses() {
    setCourseLoading(true);

    const email = jwt_decode(token).email;

    const getCourse = await fetch(
      `https://${api_gateway_id}.execute-api.us-west-2.amazonaws.com/v1/tracking?key=email&email=${email}`,
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
        setCourses(data);
      });
  }

  // API call to add course to tracking table
  const recordTracking = async (e, info) => {
    setSubmitLoading(true);
    e.preventDefault();

    const restricted = info.restricted ? "true" : "false";
    const session = info.session === "Winter" ? "W" : "S";
    const email = jwt_decode(token).email;

    const response = await fetch(
      `https://${api_gateway_id}.execute-api.us-west-2.amazonaws.com/v1/tracking`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: token,
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

    getCourses();
    setSubmitLoading(false);
    setOpen(false);

    return 200;
  };

  // API call to delete course from tracking table
  async function deleteSelectedTracking() {
    setDeleteLoading(true);
    var items = document.querySelectorAll("input[type=checkbox]:checked");
    for (var i = 0; i < items.length; i++) {
      let deleteArray = items[i].id.replace(/\s+/g, " ").trim().split(" ");
      console.log(deleteArray);
      const response = await fetch(
        `https://${api_gateway_id}.execute-api.us-west-2.amazonaws.com/v1/tracking`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            session: deleteArray[0],
            department: deleteArray[1],
            number: deleteArray[2],
            section: deleteArray[3],
            email: jwt_decode(token).email,
          }),
        }
      ).then((response) => {
        console.log("Successfully deleted course");
      });
    }
    getCourses();
    setDeleteLoading(false);
    setCourseLoading(true);
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
            <div className="flex items-center justify-center min-h-full p-4 text-center sm:p-0 mt-0">
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
                              Include Restricted Seats
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
                              disabled={submitLoading}
                            >
                              {submitLoading && (
                                <span className="text-lg font-lg font-sans text-white">
                                  Submitting...
                                </span>
                              )}
                              {!submitLoading && (
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
      <div className="flex sm:my-10 sm:mx-10 h-almost-screen my-5 mx-2">
        <div className="basis-f20 rounded-l-xl bg-cool-blue w-10 sm:w-full flex flex-col items-center">
          <SideBar />
        </div>

        <div className="basis-5/6 md:grid md:grid-cols-5 bg-white rounded-r-xl shadow-2xl">
          <div className="mt-5 md:mt-0 md:col-span-4 sm:ml-20 mx-5">
            <h1 className="sm:text-5xl font-bold font-sans text-black my-16 text-3xl">
              {" "}
              UBC Course Tracker
            </h1>

            <div className="flex justify-between">
              <span className="sm:text-2xl font-sans font-bold inline-block text-xl">
                My tracked courses
              </span>
              <div className="flex mb-2">
                <button
                  className="inline-block justify-center py-2 px-2 mr-1 border-solid border-ubc-blue border-2 shadow-sm text-lg font-sans font-lg rounded-md text-white hover:bg-ubc-grey focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indio-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={deleteSelectedTracking}
                  disabled={deleteLoading}
                >
                  {!deleteLoading && (
                    <span className="text-lg font-lg font-sans text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="#002145"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </span>
                  )}
                  {deleteLoading && (
                    <svg
                      role="status"
                      class="w-5 h-5 text-gray-200 animate-spin dark:text-ubc-grey fill-ubc-blue"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      ></path>
                    </svg>
                  )}
                </button>
                <button
                  className="inline-block justify-center py-2 px-2 border-solid border-ubc-blue border-2 shadow-sm text-lg font-sans font-lg rounded-md text-white hover:bg-ubc-grey focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indio-500"
                  onClick={() => setOpen(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="#002145"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="overflow-hidden sm:rounded-lg border-ubc-blue border-solid border-2 h-ListH">
              <div className="sm:px-4 bg-white px-0 mb-10">
                <ul className=" max-h-72 min-h-full overflow-auto overflow-y-scroll">
                  {!courseLoading && courseList}
                  {courseLoading && (
                    <svg
                      role="status"
                      class="w-5 h-5 ml-4 mt-3 text-gray-200 animate-spin dark:text-ubc-grey fill-ubc-blue"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      ></path>
                    </svg>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
