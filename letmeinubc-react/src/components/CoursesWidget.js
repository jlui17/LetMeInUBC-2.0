const CoursesWidget = () => {
  return (
    <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
      <div className="mt-5 md:mt-0 md:col-span-2">
        <div className="shadow-xl overflow-hidden sm:rounded-md">
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
              <button className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-lg font-sans font-lg rounded-md text-white bg-ubc-blue hover:bg-ubc-grey focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indio-500 disabled:opacity-50 disabled:cursor-not-allowed">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesWidget;
