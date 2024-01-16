import Header from "../Header";
import Footer from "../Footer";
import InfoStepper from "../InfoStepper";
import { Button } from "@/components/ui/button";
import { SIGNUP_URL } from "../../common/config";
import { Link } from "react-router-dom";

export default function Account() {
  return (
    <div className="overflow-hidden">
      <Header />
      <main className="flex flex-col items-center">
        <div className="relative flex min-h-[60svh] w-full flex-col items-center justify-center gap-12 bg-primary px-4 pb-44 pt-16 md:gap-16 md:px-12 lg:flex-row lg:px-36 xl:px-[15svw]">
          <div className="flex flex-col items-center lg:items-start">
            <div className="flex flex-col text-center text-4xl font-semibold text-primary-foreground sm:text-5xl lg:text-start lg:leading-[3.5rem]">
              Track your course openings with LetMeInUBC.
            </div>
            <Link to={SIGNUP_URL}>
              <Button
                variant="secondary"
                className="mt-8 w-fit font-semibold"
                size="lg"
              >
                Give it a try
              </Button>
            </Link>
          </div>
          <img
            src="/images/preview-1.png"
            alt="preview"
            className="rounded sm:h-96 lg:h-auto lg:max-w-[35svw]"
          />
          <div className="absolute bottom-0 h-0 w-0 border-b-[10vh] border-l-[50svw] border-r-[100svw] border-transparent border-b-white"></div>
        </div>

        <div className="flex w-full flex-col px-4 pb-[10svh] pt-[5svh] md:px-12 lg:px-36 xl:px-[15svw]">
          {/* how it works */}
          <div className="flex">
            <div className="flex-inline py-4 text-3xl font-bold text-black">
              <p>How Does It Work?</p>
            </div>
          </div>
          <InfoStepper />
        </div>
      </main>
      <Footer />
    </div>
  );
}
