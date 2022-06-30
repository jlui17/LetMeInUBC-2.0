import React from "react";
import { Button } from "../Button";

function Landing() {
  return (
    <>
      <div>
        Landing Page
        <Button className="inline-flex justify-center py-2 px-4 mr-4 border border-transparent shadow-sm text-lg font-sans font-lg rounded-md text-white bg-ubc-blue hover:bg-ubc-grey focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indio-500"
              Path='/dashboard'>
          To Dashboard
        </Button>
      </div>
    </>
  );
}

export default Landing;