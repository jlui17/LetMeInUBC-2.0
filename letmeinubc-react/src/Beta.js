import React from "react";
import ReactDOM from "react-dom";
import { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import jwt_decode from "jwt-decode";

function Beta() {
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState("");
  const [courseList, setCourseList] = useState([]);

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
              id={course.department}
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
        console.log(data);
        handleUpdateList(data);
      });
  }, [courses]);

  let trackedCourses;

  let tokenLogin;
  try {
    // tokenLogin = window.location.href.split('=')[1].split('&'[0])[0];
    tokenLogin =
      "eyJraWQiOiJveWtvam55MnN3WU5waVliMGtWeHRqZkY5ZHlMalVpMmRXdDZkRFBJbnprPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiS0dnNEtFVUo4eDE0Uk1TUmczVWFXdyIsInN1YiI6IjQ5MDA1NjIwLWE0M2QtNDJkMC1iM2U0LTRhYjYzN2ZjZGM3MiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtd2VzdC0yLmFtYXpvbmF3cy5jb21cL3VzLXdlc3QtMl9jejZNREZ0aVYiLCJjb2duaXRvOnVzZXJuYW1lIjoiNDkwMDU2MjAtYTQzZC00MmQwLWIzZTQtNGFiNjM3ZmNkYzcyIiwiYXVkIjoiMnNoZ3B1MTRubmo0dWxpcGU1dWk2amE2YjciLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY1NTYyMTY0NywiZXhwIjoxNjU1NjI1MjQ3LCJpYXQiOjE2NTU2MjE2NDcsImp0aSI6IjI3MGUzNjg4LTgwODEtNDZjMy1hMGM4LTNlYzI4ZmNjMjdjZiIsImVtYWlsIjoibHhyZW40NjBAZ21haWwuY29tIn0.2TaiXyPW5Q_m1mwShqJBIIgF0B6Lnkv2ucXdOo3_qnFvzoDZz_fnCoT2hrNQoRiIOB7UPBiCeZ1mOe6lJFI39dl_2eVsjfk1ivEZqHIKwDvIAqIfpGJ5ZjFgg4P7iRwdr1pVwmCiewOs3a0AiFfqctobUC-eaK77oMVSCafw41pZf66-EErNNgZSJUzQ5AO04zWzw2_qaZnSwh8NMidGVke4YuWf6gDjVka7nfAHBoVX_BtS4eHqodKd-Cu-f04z4iwkyYxd-o7ZR94sgSRmsTHJa-fs596eoSUePOLnvim-n6RaieF2Oj7id6q_sVFEMs_KOBuYkLTmD5m1SAQrGA";
  
    const getCourse = fetch(
      `https://witmeewq6e.execute-api.us-west-2.amazonaws.com/v1/tracking?key=email&email=${
        jwt_decode(tokenLogin).email
      }`,
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
        setCourses(trackedCourses?.map((course) => course.name).join(","));
      });
  } catch (e) {
    return <div>You are not signed in</div>;
  }

  const recordTracking = async (e, info) => {
    console.log("submit pressed");
    e.preventDefault();
    const token = window.location.href
      .slice(
        window.location.href.search("id_token="),
        window.location.href.search("&access_token")
      )
      .split("=")[1];
    console.log(token);

    const restricted = info.restricted ? "true" : "false";
    const session = info.session === "Winter" ? "W" : "S";
    const email = jwt_decode(token).email;

    const response = await fetch(
      "https://witmeewq6e.execute-api.us-west-2.amazonaws.com/v1/tracking",
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
    );
    console.log(response);
    const result = await response.json();
    console.log(result);
    setOpen(false);
    return 200;
  };

    function displayCheckedGroup() {
      var items = document.querySelectorAll("input[type=checkbox]:checked");
      for (var i = 0; i < items.length; i++) {
        alert(items[i].id);

      }
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
                                className="mt-1 h-10 pl-1 focus:ring-indigo-500 focus:border-inido-500 block w-full shawdow-sm sm:text-base border-gray-300 rounded-md"
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
                                className="mt-1 h-10 pl-1 focus:ring-indigo-500 focus:border-inido-500 block w-full shawdow-sm sm:text-base border-gray-300 rounded-md"
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
                              className="mt-1 h-10 pl-1 font-sans focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-lg border-gray-300 rounded-md"
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
                              class="form-check-input appearance-none h-5 w-5 border rounded-md border-ubc-grey bg-white checked:bg-ubc-blue focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                              type="checkbox"
                              name="restricted"
                              id="restricted"
                            />
                          </div>
                          <div className="px-4 py-3 mt-4 bg-ubc-grey-50 text-right sm:px-6">
                            <button
                              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-lg font-sans font-lg rounded-md text-white bg-ubc-blue hover:bg-ubc-grey focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indio-500"
                              onClick={async (e) => {
                                let res = await recordTracking(e, {
                                  department:
                                    document.getElementById("department").value,
                                  course_number:
                                    document.getElementById("course-number")
                                      .value,
                                  section:
                                    document.getElementById("section").value,
                                  session:
                                    document.getElementById("session").value,
                                  restricted:
                                    document.getElementById("restricted")
                                      .checked,
                                });
                              }}
                            >
                              Submit
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
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-3xl font-sans font-bold leading-6 text-white">
                LetMeInUBC
              </h3>
              <p className="mt-1 text-lg font-sans font-medium text-ubc-grey mt-3">
                Register Course: <br /> When a spot is available for the course
                you will receive an email.
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 bg-white sm:p-6">
                <div className="">
                  <ul className="max-h-80 ml-4 mt-4 overflow-auto overflow-y-scroll border-red-800">
                    {courseList}
                  </ul>
                </div>

                <div className="px-4 py-3 mt-4 bg-ubc-grey-50 text-right sm:px-6">
                  <button className="inline-flex justify-center py-2 px-4 mr-4 border border-transparent shadow-sm text-lg font-sans font-lg rounded-md text-white bg-ubc-blue hover:bg-ubc-grey focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indio-500">
                    Delete
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
