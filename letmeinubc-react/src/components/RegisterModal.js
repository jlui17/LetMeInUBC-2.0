import { Dialog } from "@headlessui/react";
import { CognitoIdentityServiceProvider } from "aws-sdk";

export default ({isOpen, handleClose}) => {
  const cognitoProvider = new CognitoIdentityServiceProvider();
  return (
    <Dialog open={isOpen} onClose={() => {
        handleClose();
    }}className="relative z-50">

      {/* Full-screen container to center the panel */}
      <div className="inset-0 flex items-center justify-center p-4">
        {/* The actual dialog panel  */}
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white">
          <Dialog.Title>Register</Dialog.Title>

          <div className="mt-5 md:mt-0 md:col-span-2">
            <form>
              <div className="shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-4 py-2">
                      <label
                        htmlFor="Email"
                        className="block text-lg font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <input
                        type="text"
                        name="email"
                        id="email"
                        placeholder="example@gmail.com"
                        className="mt-1 h-10 pl-1 font-sans focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-lg border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-4 py-2">
                      <label
                        htmlFor="Email"
                        className="block text-lg font-medium text-gray-700"
                      >
                        Password
                      </label>
                      <input
                        type="text"
                        name="password"
                        id="password"
                        className="mt-1 h-10 pl-1 font-sans focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-lg border-gray-300 rounded-md"
                      />
                    </div>
                    <button
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-lg font-sans font-lg rounded-md text-white bg-ubc-blue hover:bg-ubc-grey focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indio-500"
                      onClick={async () => {
                        const params = {
                          email: document.getElementById("email").value,
                          password: document.getElementById("password").value,
                        };
                        cognitoProvider.signUp(
                              params,
                              function (err) {
                                  if (err)
                                      console.log(err, err.stack);
                              }
                          );
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
      </div>
    </Dialog>
  );
};
