import { Button } from "@/components/ui/button";
import { LOGIN_URL, SIGNUP_URL } from "../common/config";
import { Link } from "react-router-dom";

export default function Header() {
  function login() {
    window.location.replace(LOGIN_URL);
    return null;
  }

  function register() {
    window.location.replace(SIGNUP_URL);
    return null;
  }
  return (
    <div className="flex flex-col justify-center bg-primary py-5 md:h-[64px] md:py-0">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 md:px-12 lg:px-36 xl:px-[15svw]">
        <a className="text-2xl font-bold text-primary-foreground" href="/">
          LetMeInUBC
        </a>
        <div className="flex w-fit flex-row justify-center gap-2">
          <Button
            onClick={login}
            variant="link"
            className="text-primary-foreground"
          >
            <Link to={LOGIN_URL}>Log in</Link>
          </Button>
          <Button onClick={register} variant="secondary">
            <Link to={SIGNUP_URL}>Register</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
