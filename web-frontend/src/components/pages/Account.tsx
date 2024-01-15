import { Token } from "src/types/cognito";
import DashboardLayout from "../DashboardLayout";
import { Button } from "@/components/ui/button";
import { FORGOT_PASSWORD_URL, LOGOUT_URL } from "../../common/config";
import { Link } from "react-router-dom";

type AccountProps = {
  token: Token | null;
};
export default function Account({ token }: AccountProps) {
  if (!token) {
    return <div>Not logged in.</div>;
  }
  return (
    <DashboardLayout activeTab="account">
      <div className="text-2xl font-bold">Account Settings</div>
      <div className="my-3 flex flex-col gap-2">
        <div className="flex justify-between">
          <div>Reset Password</div>
          <Button variant="outline">
            <Link to={FORGOT_PASSWORD_URL}>Reset</Link>
          </Button>
        </div>
        <div className="flex justify-between">
          <div>Log out</div>
          <Button>
            <Link to={LOGOUT_URL}>Log out</Link>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
